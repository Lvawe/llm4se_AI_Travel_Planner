# 如何发布 Docker 镜像到 GitHub Releases

本文档说明如何将 Docker 镜像文件发布到 GitHub Releases，供用户下载使用。

## 准备工作

### 1. 确保镜像已导出

```bash
# 导出 Docker 镜像
docker save -o ai-travel-planner.tar ai-travel-planner:latest

# 压缩镜像（可选，减小文件大小）
gzip ai-travel-planner.tar
```

### 2. 验证镜像文件

```bash
# 查看文件信息
ls -lh ai-travel-planner.tar*

# 输出示例:
# -rw-------  326M  ai-travel-planner.tar
# -rw-------  325M  ai-travel-planner.tar.gz
```

### 3. 测试镜像

```bash
# 删除本地镜像
docker rmi ai-travel-planner:latest

# 加载导出的镜像
docker load -i ai-travel-planner.tar

# 测试运行
./quick-start.sh
```

## 发布到 GitHub Releases

### 方式 1: 使用 GitHub Web 界面（推荐）

#### 步骤 1: 创建新的 Release

1. 访问仓库页面: https://github.com/Lvawe/llm4se_AI_Travel_Planner
2. 点击右侧的 "Releases"
3. 点击 "Draft a new release" 或 "Create a new release"

#### 步骤 2: 填写 Release 信息

**Tag version** (版本标签):
```
v1.0.0
```

**Release title** (发布标题):
```
AI Travel Planner v1.0.0 - 首次发布
```

**Description** (描述):
```markdown
# 🎉 AI Travel Planner v1.0.0

这是 AI Travel Planner 的首个正式版本！

## ✨ 主要功能

- 🎤 **智能语音填写**: 语音识别自动填充表单
- 🤖 **AI 行程规划**: 通义千问智能生成旅行计划
- 📍 **地图集成**: 高德地图实时导航
- 💰 **费用管理**: 预算跟踪和统计
- 🔐 **用户系统**: JWT 认证和云端同步

## 📦 下载和使用

### 快速开始

1. **下载镜像文件**
   - `ai-travel-planner.tar` (326MB) - 原始镜像
   - `ai-travel-planner.tar.gz` (325MB) - 压缩镜像（推荐）

2. **加载镜像**
   ```bash
   # 如果下载的是 .tar.gz，先解压
   gunzip ai-travel-planner.tar.gz
   
   # 加载镜像到 Docker
   docker load -i ai-travel-planner.tar
   ```

3. **配置环境**
   
   下载 `.env.example` 并重命名为 `.env`，填写必要的配置:
   - `DATABASE_URL`: Supabase 数据库连接
   - `DASHSCOPE_API_KEY`: 阿里云 API Key
   - `NEXT_PUBLIC_AMAP_KEY`: 高德地图 API Key

4. **运行容器**
   ```bash
   # 使用快速启动脚本
   ./quick-start.sh
   
   # 或手动运行
   docker run -d \
     --name ai-travel-planner \
     --restart unless-stopped \
     -p 5090:5090 \
     -p 3001:3001 \
     --add-host host.docker.internal:host-gateway \
     --env-file .env \
     ai-travel-planner:latest
   ```

5. **访问应用**
   - 前端: http://localhost:5090
   - 后端 API: http://localhost:3001

### 或从阿里云镜像仓库拉取

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

## 📖 完整文档

- [README](https://github.com/Lvawe/llm4se_AI_Travel_Planner/blob/main/README.md)
- [Docker 镜像使用指南](https://github.com/Lvawe/llm4se_AI_Travel_Planner/blob/main/DOCKER_IMAGE_GUIDE.md)
- [发布说明](https://github.com/Lvawe/llm4se_AI_Travel_Planner/blob/main/RELEASE_NOTES.md)

## 🐛 已知问题

- Docker 容器不支持 IPv6，使用 Supabase 需要配置 socat 代理
- 首次启动需要 30-40 秒
- 语音识别需要 HTTPS 或 localhost 环境

## 📞 支持

遇到问题？请访问 [Issues](https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues)

---

**完整更新日志**: [RELEASE_NOTES.md](https://github.com/Lvawe/llm4se_AI_Travel_Planner/blob/main/RELEASE_NOTES.md)
```

#### 步骤 3: 上传文件

在 "Attach binaries" 区域，拖拽或选择以下文件:

**必须上传**:
- ✅ `ai-travel-planner.tar` 或 `ai-travel-planner.tar.gz` (Docker 镜像)
- ✅ `quick-start.sh` (快速启动脚本)
- ✅ `.env.example` (环境变量模板)

**可选上传**:
- `DOCKER_IMAGE_GUIDE.md` (使用指南)
- `RELEASE_NOTES.md` (发布说明)

#### 步骤 4: 发布

1. 如果是正式版本，勾选 "Set as the latest release"
2. 如果还在测试，勾选 "This is a pre-release"
3. 点击 "Publish release"

### 方式 2: 使用 GitHub CLI

#### 安装 GitHub CLI

```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# 或访问: https://cli.github.com/
```

#### 登录 GitHub

```bash
gh auth login
```

#### 创建 Release

```bash
# 创建 release 并上传文件
gh release create v1.0.0 \
  --title "AI Travel Planner v1.0.0 - 首次发布" \
  --notes-file RELEASE_NOTES.md \
  ai-travel-planner.tar.gz \
  quick-start.sh \
  .env.example \
  DOCKER_IMAGE_GUIDE.md

# 或从文件读取描述
gh release create v1.0.0 \
  --title "AI Travel Planner v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  ai-travel-planner.tar.gz#"Docker 镜像文件 (326MB 压缩)" \
  quick-start.sh#"快速启动脚本" \
  .env.example#"环境变量配置模板"
```

#### 查看 Release

```bash
# 列出所有 releases
gh release list

# 查看特定 release
gh release view v1.0.0
```

### 方式 3: 使用 GitHub Actions 自动发布

创建 `.github/workflows/release.yml`:

```yaml
name: Create Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build Docker image
        run: |
          docker build -t ai-travel-planner:latest .

      - name: Save Docker image
        run: |
          docker save -o ai-travel-planner.tar ai-travel-planner:latest
          gzip ai-travel-planner.tar

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            ai-travel-planner.tar.gz
            quick-start.sh
            .env.example
            DOCKER_IMAGE_GUIDE.md
          body_path: RELEASE_NOTES.md
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

使用方法:
```bash
# 创建并推送 tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# GitHub Actions 会自动构建并创建 Release
```

## 文件说明

### ai-travel-planner.tar(.gz)

**大小**: 326MB (压缩后 325MB)  
**用途**: Docker 镜像文件，包含完整应用  
**使用**: `docker load -i ai-travel-planner.tar`

### quick-start.sh

**大小**: ~5KB  
**用途**: 一键启动脚本，自动检查环境并启动容器  
**使用**: `chmod +x quick-start.sh && ./quick-start.sh`

### .env.example

**大小**: ~2KB  
**用途**: 环境变量配置模板  
**使用**: 
```bash
cp .env.example .env
# 编辑 .env 填写实际配置
```

### DOCKER_IMAGE_GUIDE.md

**大小**: ~15KB  
**用途**: 详细的 Docker 镜像使用指南  
**包含**: 安装、配置、故障排除等

## 最佳实践

### 1. 版本命名

遵循语义化版本 (Semantic Versioning):
- `v1.0.0` - 主版本.次版本.修订号
- `v1.0.0-beta.1` - 预发布版本
- `v1.0.0-rc.1` - 候选版本

### 2. 文件压缩

大文件建议压缩上传:
```bash
# gzip 压缩 (更快，兼容性好)
gzip ai-travel-planner.tar

# bzip2 压缩 (压缩率更高)
bzip2 ai-travel-planner.tar

# xz 压缩 (压缩率最高，但较慢)
xz ai-travel-planner.tar
```

### 3. 校验文件完整性

生成校验和文件:
```bash
# SHA256
sha256sum ai-travel-planner.tar.gz > ai-travel-planner.tar.gz.sha256

# MD5
md5sum ai-travel-planner.tar.gz > ai-travel-planner.tar.gz.md5
```

一并上传到 Release，用户可以验证:
```bash
# 验证 SHA256
sha256sum -c ai-travel-planner.tar.gz.sha256

# 验证 MD5
md5sum -c ai-travel-planner.tar.gz.md5
```

### 4. 编写清晰的 Release Notes

Release Notes 应包含:
- ✅ 新功能 (New Features)
- ✅ 改进 (Improvements)
- ✅ 修复 (Bug Fixes)
- ✅ 破坏性变更 (Breaking Changes)
- ✅ 已知问题 (Known Issues)
- ✅ 升级指南 (Migration Guide)

### 5. 标记稳定版本

- 第一个稳定版本标记为 "Latest"
- 测试版本标记为 "Pre-release"
- 重要版本标记为 "Featured"

## 维护和更新

### 更新现有 Release

```bash
# 删除旧文件
gh release delete-asset v1.0.0 ai-travel-planner.tar.gz

# 上传新文件
gh release upload v1.0.0 ai-travel-planner.tar.gz

# 更新说明
gh release edit v1.0.0 --notes-file RELEASE_NOTES.md
```

### 删除 Release

```bash
# 删除 release（保留 tag）
gh release delete v1.0.0

# 同时删除 tag
gh release delete v1.0.0 --yes
git push origin :refs/tags/v1.0.0
```

## 用户下载和使用

用户可以通过以下方式获取:

### 1. GitHub Releases 页面下载

访问: https://github.com/Lvawe/llm4se_AI_Travel_Planner/releases

### 2. 使用 wget/curl 下载

```bash
# 下载最新版本
wget https://github.com/Lvawe/llm4se_AI_Travel_Planner/releases/latest/download/ai-travel-planner.tar.gz

# 或使用 curl
curl -LO https://github.com/Lvawe/llm4se_AI_Travel_Planner/releases/latest/download/ai-travel-planner.tar.gz
```

### 3. 使用 GitHub CLI

```bash
# 下载最新 release
gh release download --repo Lvawe/llm4se_AI_Travel_Planner

# 下载特定版本
gh release download v1.0.0 --repo Lvawe/llm4se_AI_Travel_Planner
```

## 文件大小限制

GitHub Releases 文件大小限制:
- 单个文件: 最大 2GB
- Release 总大小: 无限制（但建议合理控制）

如果镜像文件超过 2GB:
1. 分卷压缩: `split -b 1G ai-travel-planner.tar ai-travel-planner.tar.part`
2. 使用其他托管服务（如阿里云 OSS）
3. 推荐用户从镜像仓库拉取

## 常见问题

### Q: 文件上传失败？

A: 检查:
- 文件大小是否超过 2GB
- 网络连接是否稳定
- 是否有足够的权限

### Q: 如何让用户自动获取最新版本？

A: 使用 `latest` 标签的下载链接:
```
https://github.com/USER/REPO/releases/latest/download/FILE
```

### Q: 是否应该上传源代码？

A: GitHub 会自动附加源代码压缩包（zip 和 tar.gz），无需手动上传。

## 总结

完整的发布流程:

```bash
# 1. 导出并压缩镜像
docker save -o ai-travel-planner.tar ai-travel-planner:latest
gzip ai-travel-planner.tar

# 2. 生成校验和
sha256sum ai-travel-planner.tar.gz > checksums.txt

# 3. 创建 tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 4. 创建 Release
gh release create v1.0.0 \
  --title "AI Travel Planner v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  ai-travel-planner.tar.gz \
  checksums.txt \
  quick-start.sh \
  .env.example

# 5. 验证
gh release view v1.0.0
```

现在用户就可以从 GitHub Releases 下载并直接运行你的 Docker 镜像了！
