# 📋 文档导航

本项目的文档已重新整理，更加清晰易读。以下是文档导航：

## 🚀 快速上手

1. **[README.md](./README.md)** - 项目简介和快速开始
   - 项目特性介绍
   - 技术栈说明
   - 快速启动步骤
   - API Key 配置

2. **[QUICKSTART.md](./QUICKSTART.md)** - 5 分钟快速上手指南
   - 最简化的启动步骤
   - 常见问题解决
   - 测试账号信息

## 📚 功能使用指南

3. **[VOICE_AND_AI_GUIDE.md](./VOICE_AND_AI_GUIDE.md)** - 语音输入和 AI 规划功能
   - 语音输入使用方法
   - AI 生成行程功能
   - 完整工作流程
   - 技术实现细节
   - 常见问题解答

4. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - 项目结构说明
   - 完整目录结构
   - 核心文件说明
   - 数据库模型
   - API 路由列表
   - 开发命令

## 🔧 配置和部署

5. **[docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Supabase 数据库配置
   - Supabase 账号创建
   - 项目设置
   - 连接字符串获取
   - 数据库迁移

6. **[docs/API_CONFIG.md](./docs/API_CONFIG.md)** - API Key 配置详解
   - 阿里云百炼 API 配置
   - 高德地图 API 配置
   - 环境变量设置

7. **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - 开发指南
   - 开发环境设置
   - 代码规范
   - Git 工作流
   - 调试技巧

8. **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - 部署指南
   - Docker 部署
   - 云服务器部署
   - 环境配置
   - 持续集成

## 📁 文件组织结构

```
llm4se_AI_Travel_Planner/
│
├── 📄 README.md                    # 项目简介（从这里开始）
├── 📄 QUICKSTART.md                # 快速上手（5分钟入门）
├── 📄 VOICE_AND_AI_GUIDE.md        # 语音和AI功能指南
├── 📄 PROJECT_STRUCTURE.md         # 项目结构详解
├── 📄 LICENSE                      # MIT 许可证
├── 📄 .gitignore                   # Git 忽略配置
├── 📄 docker-compose.yml           # Docker 编排配置
│
├── 📂 docs/                        # 详细文档目录
│   ├── SUPABASE_SETUP.md          # Supabase 配置
│   ├── API_CONFIG.md              # API Key 配置
│   ├── DEVELOPMENT.md             # 开发指南
│   └── DEPLOYMENT.md              # 部署指南
│
├── 📂 frontend/                    # Next.js 前端
│   ├── src/                       # 源代码
│   ├── public/                    # 静态资源
│   ├── .env.local                 # 前端环境变量
│   └── package.json               # 前端依赖
│
├── 📂 backend/                     # Express 后端
│   ├── src/                       # 源代码
│   ├── prisma/                    # 数据库配置
│   ├── .env                       # 后端环境变量
│   └── package.json               # 后端依赖
│
└── 📂 docker/                      # Docker 镜像配置
    ├── Dockerfile.frontend
    ├── Dockerfile.backend
    └── docker-compose.yml
```

## 🗂️ 已删除的文件

为了保持项目清晰，以下文件已被删除或合并：

### 删除的临时文件
- ❌ `.DS_Store` - macOS 系统文件
- ❌ `check-config.js` - 临时配置检查脚本
- ❌ 根目录的 `.env` - 环境变量已移至各自目录
- ❌ 根目录的 `package.json` - 不需要根级依赖
- ❌ `start.sh` - 使用 npm scripts 代替

### 删除的重复文档
- ❌ `CONFIG_CHECKLIST.md` - 内容已合并到 API_CONFIG.md
- ❌ `PROJECT_OVERVIEW.md` - 内容已合并到 README.md
- ❌ `CHANGELOG.md` - 使用 Git 历史代替
- ❌ `docs/LOGIN_STATUS.md` - 调试文档，已完成
- ❌ `docs/PROGRESS.md` - 临时进度文档
- ❌ `docs/TESTING.md` - 测试内容已整合
- ❌ `docs/VOICE_RECOGNITION.md` - 已合并到 VOICE_AND_AI_GUIDE.md
- ❌ `docs/AMAP_SETUP.md` - 已合并到 API_CONFIG.md
- ❌ `docs/FEATURE_SUMMARY.md` - 已合并到 README.md
- ❌ `docs/LLM_INTEGRATION.md` - 已合并到 VOICE_AND_AI_GUIDE.md

## 📖 阅读建议

### 新用户（第一次使用）
1. 阅读 [README.md](./README.md) 了解项目
2. 跟随 [QUICKSTART.md](./QUICKSTART.md) 快速启动
3. 参考 [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) 配置数据库
4. 参考 [docs/API_CONFIG.md](./docs/API_CONFIG.md) 配置 API

### 功能使用
5. 阅读 [VOICE_AND_AI_GUIDE.md](./VOICE_AND_AI_GUIDE.md) 了解核心功能

### 开发者
6. 阅读 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解代码结构
7. 参考 [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) 开发规范

### 部署上线
8. 参考 [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) 部署到生产环境

## 🔄 文档更新

所有文档最后更新时间：**2025-11-05**

如发现文档问题或需要补充，请提交 Issue 或 Pull Request。

---

**提示**：建议按照上述顺序阅读文档，可以更快上手项目！
