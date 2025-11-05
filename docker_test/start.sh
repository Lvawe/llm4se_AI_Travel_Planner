#!/bin/bash

# AI Travel Planner - 测试环境快速启动脚本

set -e

echo "🚀 AI Travel Planner - 测试环境启动"
echo "===================================="
echo ""

# 检查文件
echo "📦 检查必要文件..."
if [ ! -f "ai-travel-planner.tar" ]; then
    echo "❌ 找不到 ai-travel-planner.tar"
    exit 1
fi
echo "✅ Docker 镜像文件存在"

if [ ! -f ".env" ]; then
    echo "❌ 找不到 .env 文件"
    if [ -f "env.example" ]; then
        echo "📝 从 env.example 创建 .env..."
        cp env.example .env
        echo "⚠️  请编辑 .env 文件填写配置，然后重新运行此脚本"
        exit 1
    else
        echo "❌ 也找不到 env.example 文件"
        exit 1
    fi
fi
echo "✅ .env 文件存在"
echo ""

# 检查 DATABASE_URL
echo "🔍 检查配置..."
source .env
if [[ "$DATABASE_URL" == *"host.docker.internal:25432"* ]]; then
    echo "✅ DATABASE_URL 使用代理地址"
    
    # 检查代理是否运行
    if ! lsof -Pi :25432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo ""
        echo "⚠️  警告: socat 代理未运行 (端口 25432)"
        echo ""
        echo "需要启动代理连接 Supabase IPv6 数据库:"
        echo "socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.sygvmnyyzyynuewppitb.supabase.co:5432 &"
        echo ""
        read -p "是否继续? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ socat 代理正在运行"
    fi
fi
echo ""

# 检查镜像是否已加载
echo "🖼️  检查 Docker 镜像..."
if docker images | grep -q "ai-travel-planner.*latest"; then
    echo "✅ 镜像已加载"
else
    echo "📥 加载 Docker 镜像..."
    docker load -i ai-travel-planner.tar
    echo "✅ 镜像加载完成"
fi
echo ""

# 检查并清理旧容器
if docker ps -a | grep -q "ai-travel-planner"; then
    echo "🧹 清理旧容器..."
    docker rm -f ai-travel-planner 2>/dev/null || true
fi

# 启动容器
echo "🚀 启动容器..."
docker run -d \
  --name ai-travel-planner \
  --restart unless-stopped \
  -p 5090:5090 \
  -p 3001:3001 \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  ai-travel-planner:latest

echo "✅ 容器已启动"
echo ""

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 测试服务
echo ""
echo "🏥 测试服务健康状态..."

RETRY=0
MAX_RETRY=10

# 测试后端
while [ $RETRY -lt $MAX_RETRY ]; do
    if curl -s --max-time 2 http://localhost:3001/health > /dev/null 2>&1; then
        HEALTH=$(curl -s http://localhost:3001/health)
        echo "✅ 后端服务正常: $HEALTH"
        break
    fi
    RETRY=$((RETRY+1))
    if [ $RETRY -lt $MAX_RETRY ]; then
        echo "   等待后端启动... ($RETRY/$MAX_RETRY)"
        sleep 2
    fi
done

if [ $RETRY -eq $MAX_RETRY ]; then
    echo "❌ 后端服务启动失败"
    echo ""
    echo "查看日志:"
    docker logs ai-travel-planner --tail 20
    exit 1
fi

# 测试前端
RETRY=0
while [ $RETRY -lt $MAX_RETRY ]; do
    if curl -s --max-time 2 http://localhost:5090 > /dev/null 2>&1; then
        echo "✅ 前端服务正常"
        break
    fi
    RETRY=$((RETRY+1))
    if [ $RETRY -lt $MAX_RETRY ]; then
        echo "   等待前端启动... ($RETRY/$MAX_RETRY)"
        sleep 2
    fi
done

if [ $RETRY -eq $MAX_RETRY ]; then
    echo "❌ 前端服务启动失败"
    echo ""
    echo "查看日志:"
    docker logs ai-travel-planner --tail 20
    exit 1
fi

# 成功
echo ""
echo "✅ AI Travel Planner 启动成功！"
echo "===================================="
echo ""
echo "📍 访问地址:"
echo "  - 前端: http://localhost:5090"
echo "  - 后端 API: http://localhost:3001"
echo "  - 健康检查: http://localhost:3001/health"
echo ""
echo "📋 常用命令:"
echo "  - 查看日志: docker logs -f ai-travel-planner"
echo "  - 停止服务: docker stop ai-travel-planner"
echo "  - 重启服务: docker restart ai-travel-planner"
echo "  - 删除容器: docker rm -f ai-travel-planner"
echo ""
echo "🌐 在浏览器中打开应用:"
echo "  open http://localhost:5090"
echo ""
