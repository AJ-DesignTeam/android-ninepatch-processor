# 部署指南

本文档详细说明如何将.9图预处理工具部署到GitHub Pages。

## 🚀 快速部署

### 1. 准备GitHub仓库

1. 在GitHub上创建一个新的仓库，命名为 `ninepatch-tool`
2. 将本地项目推送到GitHub仓库：

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/ninepatch-tool.git

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: NinePatch Preprocessor Tool"

# 推送到GitHub
git push -u origin main
```

### 2. 启用GitHub Pages

1. 进入GitHub仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 3. 自动部署

项目已经配置了GitHub Actions工作流，当你推送代码到main分支时会自动：
- 安装依赖
- 构建项目
- 部署到GitHub Pages

部署完成后，你的网站将在以下地址可用：
`https://YOUR_USERNAME.github.io/ninepatch-tool/`

## 🔧 手动部署

如果你想手动部署，可以按照以下步骤：

### 1. 本地构建

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build
```

### 2. 部署到GitHub Pages

```bash
# 安装gh-pages工具
npm install -g gh-pages

# 部署dist目录到gh-pages分支
gh-pages -d dist
```

## 🌐 自定义域名（可选）

如果你有自定义域名，可以按照以下步骤配置：

### 1. 添加CNAME文件

在 `public` 目录下创建 `CNAME` 文件：

```bash
echo "your-domain.com" > public/CNAME
```

### 2. 更新GitHub Actions配置

在 `.github/workflows/deploy.yml` 文件中取消注释并填写你的域名：

```yaml
- name: Deploy to GitHub Pages
  if: github.ref == 'refs/heads/main'
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    cname: your-domain.com  # 填写你的域名
```

### 3. 配置DNS

在你的域名提供商处配置DNS记录：
- 类型：CNAME
- 名称：www（或@用于根域名）
- 值：YOUR_USERNAME.github.io

## 📊 监控部署状态

### 查看部署日志

1. 进入GitHub仓库页面
2. 点击 **Actions** 标签
3. 查看最新的工作流运行状态

### 常见问题排查

#### 构建失败
- 检查 `package.json` 中的依赖版本
- 确保所有文件都已正确提交
- 查看Actions日志中的错误信息

#### 页面无法访问
- 确认GitHub Pages已启用
- 检查仓库名称是否正确
- 等待几分钟让DNS传播

#### 资源加载失败
- 检查 `vite.config.js` 中的 `base` 配置
- 确保路径配置正确

## 🔄 更新部署

每次推送到main分支时，GitHub Actions会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "Update: description of changes"
git push origin main
```

## 🛠️ 高级配置

### 环境变量

如果需要配置环境变量，可以在GitHub仓库的Settings > Secrets and variables > Actions中添加：

- `NODE_ENV`: 设置为 `production`
- 其他自定义环境变量

### 缓存优化

GitHub Actions已配置了依赖缓存，可以加快构建速度。如果遇到缓存问题，可以：

1. 在Actions页面手动清除缓存
2. 或者修改 `.github/workflows/deploy.yml` 中的缓存键

### 多环境部署

如果需要部署到多个环境（如staging和production），可以：

1. 创建不同的分支（如 `staging`、`main`）
2. 为每个分支配置不同的工作流
3. 使用不同的域名或子域名

## 📝 部署检查清单

部署前请确认：

- [ ] 所有功能都已测试
- [ ] README.md文档已更新
- [ ] 版本号已更新（package.json）
- [ ] 构建无错误
- [ ] 所有文件已提交到Git
- [ ] GitHub Pages已启用
- [ ] 域名配置正确（如果使用自定义域名）

## 🆘 获取帮助

如果在部署过程中遇到问题：

1. 查看GitHub Actions的详细日志
2. 检查GitHub Pages的设置
3. 参考GitHub官方文档
4. 在项目Issues中提问

---

祝你部署顺利！🎉

