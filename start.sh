#!/bin/bash

# AI Travel Planner - Quick Start Script
# 快速启动脚本

set -e

echo "🚀 AI Travel Planner - 快速启动"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请根据需要修改配置"
    echo ""
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ 未检测到 Docker，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 未检测到 Docker Compose，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# Start services
echo "🐳 启动 Docker 容器..."
docker-compose up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ 服务启动成功！"
    echo ""
    echo "📍 访问地址:"
    echo "   前端: http://localhost:3000"
    echo "   后端: http://localhost:3001"
    echo "   健康检查: http://localhost:3001/health"
    echo ""
    echo "📋 常用命令:"
    echo "   查看日志: docker-compose logs -f"
    echo "   停止服务: docker-compose down"
    echo "   重启服务: docker-compose restart"
    echo ""
else
    echo "❌ 服务启动失败，请查看日志: docker-compose logs"
    exit 1
fi
