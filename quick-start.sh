#!/bin/bash

# AI Travel Planner - 快速启动脚本
# 使用方法: ./quick-start.sh [镜像文件路径]

set -e

echo "🚀 AI Travel Planner - 快速启动脚本"
echo "===================================="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查是否提供了镜像文件路径
IMAGE_FILE=${1:-"ai-travel-planner.tar"}

if [ "$1" != "" ] && [ -f "$IMAGE_FILE" ]; then
    echo "📦 加载 Docker 镜像: $IMAGE_FILE"
    docker load -i "$IMAGE_FILE"
    echo "✅ 镜像加载成功"
    echo ""
fi

# 检查镜像是否存在
if ! docker images | grep -q "ai-travel-planner"; then
    echo "❌ 错误: 找不到 ai-travel-planner 镜像"
    echo ""
    echo "请使用以下方法之一:"
    echo "1. 提供 tar 文件: ./quick-start.sh ai-travel-planner.tar"
    echo "2. 从阿里云拉取: docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest"
    exit 1
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到 .env 文件"
    
    if [ -f "env.example" ]; then
        echo "📝 从 env.example 创建 .env 文件..."
        cp env.example .env
        echo "✅ .env 文件已创建，请编辑配置"
        echo ""
        echo "重要配置项:"
        echo "- DATABASE_URL: 数据库连接字符串"
        echo "- DASHSCOPE_API_KEY: 阿里云 API Key"
        echo "- NEXT_PUBLIC_AMAP_KEY: 高德地图 API Key"
        echo ""
        read -p "是否继续? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "❌ 错误: 请创建 .env 文件"
        echo "参考 DOCKER_IMAGE_GUIDE.md 文档"
        exit 1
    fi
fi

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  警告: 端口 $port 已被占用"
        return 1
    fi
    return 0
}

echo "🔍 检查端口..."
PORT_OK=true
if ! check_port 5090; then
    PORT_OK=false
fi
if ! check_port 3001; then
    PORT_OK=false
fi

if [ "$PORT_OK" = false ]; then
    echo ""
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查是否需要数据库代理
source .env
if [[ "$DATABASE_URL" == *"host.docker.internal:25432"* ]]; then
    echo "🔌 检查数据库代理..."
    
    if ! lsof -Pi :25432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  警告: 数据库代理未运行 (端口 25432)"
        echo ""
        echo "如果你使用 Supabase IPv6 连接，需要启动代理:"
        echo "socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.sygvmnyyzyynuewppitb.supabase.co:5432 &"
        echo ""
        read -p "是否继续? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ 数据库代理正在运行"
    fi
fi

# 停止并删除旧容器
if docker ps -a | grep -q "ai-travel-planner"; then
    echo "🛑 停止旧容器..."
    docker stop ai-travel-planner 2>/dev/null || true
    docker rm ai-travel-planner 2>/dev/null || true
fi

# 启动容器
echo ""
echo "🚀 启动容器..."
docker run -d \
  --name ai-travel-planner \
  --restart unless-stopped \
  -p 5090:5090 \
  -p 3001:3001 \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  ai-travel-planner:latest

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 检查健康状态
echo "🏥 检查服务健康状态..."
RETRY=0
MAX_RETRY=10

while [ $RETRY -lt $MAX_RETRY ]; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ 后端服务正常"
        break
    fi
    RETRY=$((RETRY+1))
    echo "等待后端启动... ($RETRY/$MAX_RETRY)"
    sleep 2
done

if [ $RETRY -eq $MAX_RETRY ]; then
    echo "❌ 后端服务启动失败"
    echo "查看日志: docker logs ai-travel-planner"
    exit 1
fi

RETRY=0
while [ $RETRY -lt $MAX_RETRY ]; do
    if curl -s http://localhost:5090 > /dev/null 2>&1; then
        echo "✅ 前端服务正常"
        break
    fi
    RETRY=$((RETRY+1))
    echo "等待前端启动... ($RETRY/$MAX_RETRY)"
    sleep 2
done

if [ $RETRY -eq $MAX_RETRY ]; then
    echo "❌ 前端服务启动失败"
    echo "查看日志: docker logs ai-travel-planner"
    exit 1
fi

# 成功启动
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
echo ""
echo "📖 更多信息请查看: DOCKER_IMAGE_GUIDE.md"
