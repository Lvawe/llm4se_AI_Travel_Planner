#!/bin/bash

# AI Travel Planner - 停止和清理脚本

echo "🛑 停止 AI Travel Planner..."
echo ""

# 停止容器
if docker ps | grep -q "ai-travel-planner"; then
    echo "🐳 停止容器..."
    docker stop ai-travel-planner
    echo "✅ 容器已停止"
else
    echo "ℹ️  容器未运行"
fi

# 询问是否删除容器
echo ""
read -p "是否删除容器? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if docker ps -a | grep -q "ai-travel-planner"; then
        docker rm ai-travel-planner
        echo "✅ 容器已删除"
    fi
fi

# 询问是否删除镜像
echo ""
read -p "是否删除 Docker 镜像? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if docker images | grep -q "ai-travel-planner"; then
        docker rmi ai-travel-planner:latest
        echo "✅ 镜像已删除"
    fi
fi

echo ""
echo "✅ 清理完成"
