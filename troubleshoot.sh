#!/bin/bash

# AI Travel Planner - 故障排查脚本
# 用于诊断 Docker 部署常见问题

echo "🔍 AI Travel Planner - 故障排查工具"
echo "===================================="
echo ""

ISSUES_FOUND=0

# 1. 检查 Docker 是否安装
echo "📦 检查 Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    echo "   请安装 Docker: https://docs.docker.com/get-docker/"
    ISSUES_FOUND=$((ISSUES_FOUND+1))
else
    echo "✅ Docker 已安装: $(docker --version)"
fi
echo ""

# 2. 检查 .env 文件
echo "📝 检查环境配置..."
if [ ! -f ".env" ]; then
    echo "❌ .env 文件不存在"
    echo "   解决方案: cp env.example .env"
    ISSUES_FOUND=$((ISSUES_FOUND+1))
else
    echo "✅ .env 文件存在"
    
    # 检查必需的环境变量
    if ! grep -q "DATABASE_URL=" .env; then
        echo "⚠️  DATABASE_URL 未配置"
        ISSUES_FOUND=$((ISSUES_FOUND+1))
    else
        DATABASE_URL=$(grep "DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"')
        if [ -z "$DATABASE_URL" ]; then
            echo "❌ DATABASE_URL 为空"
            ISSUES_FOUND=$((ISSUES_FOUND+1))
        else
            echo "✅ DATABASE_URL 已配置"
            
            # 检查是否使用代理地址
            if [[ "$DATABASE_URL" == *"host.docker.internal:25432"* ]]; then
                echo "✅ 使用 Docker 代理地址"
            elif [[ "$DATABASE_URL" == *"supabase.co:5432"* ]]; then
                echo "⚠️  使用直接 Supabase 地址，Docker 可能无法连接"
                echo "   建议修改为: host.docker.internal:25432"
                ISSUES_FOUND=$((ISSUES_FOUND+1))
            fi
        fi
    fi
    
    if ! grep -q "DASHSCOPE_API_KEY=" .env; then
        echo "⚠️  DASHSCOPE_API_KEY 未配置"
    fi
    
    if ! grep -q "NEXT_PUBLIC_AMAP_KEY=" .env; then
        echo "⚠️  NEXT_PUBLIC_AMAP_KEY 未配置"
    fi
fi
echo ""

# 3. 检查端口占用
echo "🔌 检查端口..."
PORT_OK=true

if lsof -Pi :5090 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PROCESS=$(lsof -Pi :5090 -sTCP:LISTEN | tail -n 1)
    echo "⚠️  端口 5090 已被占用"
    echo "   进程: $PROCESS"
    PORT_OK=false
    ISSUES_FOUND=$((ISSUES_FOUND+1))
else
    echo "✅ 端口 5090 可用"
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PROCESS=$(lsof -Pi :3001 -sTCP:LISTEN | tail -n 1)
    echo "⚠️  端口 3001 已被占用"
    echo "   进程: $PROCESS"
    PORT_OK=false
    ISSUES_FOUND=$((ISSUES_FOUND+1))
else
    echo "✅ 端口 3001 可用"
fi
echo ""

# 4. 检查数据库代理
echo "🌐 检查数据库代理..."
if [ -f ".env" ]; then
    DATABASE_URL=$(grep "DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"')
    if [[ "$DATABASE_URL" == *"host.docker.internal:25432"* ]]; then
        if lsof -Pi :25432 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "✅ socat 代理正在运行 (端口 25432)"
            PROXY_PROCESS=$(lsof -Pi :25432 -sTCP:LISTEN | tail -n 1)
            echo "   进程: $PROXY_PROCESS"
        else
            echo "❌ socat 代理未运行"
            echo "   启动命令: socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.YOUR_PROJECT.supabase.co:5432 &"
            ISSUES_FOUND=$((ISSUES_FOUND+1))
        fi
    else
        echo "ℹ️  未使用代理地址，跳过检查"
    fi
fi
echo ""

# 5. 检查 Docker 镜像
echo "🖼️  检查 Docker 镜像..."
if docker images | grep -q "ai-travel-planner"; then
    echo "✅ ai-travel-planner 镜像存在"
    docker images | grep "ai-travel-planner"
else
    echo "❌ ai-travel-planner 镜像不存在"
    echo "   加载镜像: docker load -i ai-travel-planner.tar"
    ISSUES_FOUND=$((ISSUES_FOUND+1))
fi
echo ""

# 6. 检查容器状态
echo "🐳 检查容器状态..."
if docker ps -a | grep -q "ai-travel-planner"; then
    CONTAINER_STATUS=$(docker ps -a --filter name=ai-travel-planner --format "{{.Status}}")
    if docker ps | grep -q "ai-travel-planner"; then
        echo "✅ 容器正在运行"
        echo "   状态: $CONTAINER_STATUS"
        
        # 检查健康状态
        if [[ "$CONTAINER_STATUS" == *"unhealthy"* ]]; then
            echo "⚠️  容器健康检查失败"
            echo "   查看日志: docker logs ai-travel-planner"
            ISSUES_FOUND=$((ISSUES_FOUND+1))
        fi
    else
        echo "⚠️  容器已停止"
        echo "   状态: $CONTAINER_STATUS"
        echo "   启动命令: docker start ai-travel-planner"
        ISSUES_FOUND=$((ISSUES_FOUND+1))
    fi
    
    # 显示最近日志
    echo ""
    echo "📋 容器最近日志:"
    docker logs ai-travel-planner --tail 10 2>&1 | sed 's/^/   /'
else
    echo "ℹ️  容器不存在"
    echo "   创建容器: ./quick-start.sh"
fi
echo ""

# 7. 测试服务可访问性
echo "🌐 测试服务..."
if docker ps | grep -q "ai-travel-planner"; then
    # 测试后端
    if curl -s --max-time 5 http://localhost:3001/health > /dev/null 2>&1; then
        HEALTH=$(curl -s http://localhost:3001/health)
        echo "✅ 后端服务正常: $HEALTH"
    else
        echo "❌ 后端服务无响应 (http://localhost:3001)"
        ISSUES_FOUND=$((ISSUES_FOUND+1))
    fi
    
    # 测试前端
    if curl -s --max-time 5 http://localhost:5090 > /dev/null 2>&1; then
        echo "✅ 前端服务正常 (http://localhost:5090)"
    else
        echo "❌ 前端服务无响应 (http://localhost:5090)"
        ISSUES_FOUND=$((ISSUES_FOUND+1))
    fi
else
    echo "⚠️  容器未运行，跳过服务测试"
fi
echo ""

# 总结
echo "===================================="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo "✅ 所有检查通过！系统运行正常"
    echo ""
    echo "📍 访问地址:"
    echo "   - 前端: http://localhost:5090"
    echo "   - 后端: http://localhost:3001"
else
    echo "⚠️  发现 $ISSUES_FOUND 个问题"
    echo ""
    echo "💡 建议操作:"
    echo "   1. 查看上述错误信息"
    echo "   2. 参考 DOCKER_IMAGE_GUIDE.md 文档"
    echo "   3. 运行 docker logs ai-travel-planner 查看详细日志"
    echo "   4. 访问 GitHub Issues 寻求帮助"
fi
echo ""
