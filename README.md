# .9图预处理工具 (NinePatch Preprocessor)

一个现代化的网页版Android .9图（NinePatch）预处理工具，提供完整的.9图解析、验证、预览和编译功能。

## 🌟 功能特性

### 核心功能
- **📁 文件上传**: 支持拖拽上传和点击选择，兼容PNG格式
- **🔍 自动解析**: 智能识别.9图的拉伸区域和内容区域标记
- **⚡ 实时预览**: 动态调整尺寸查看拉伸效果
- **📝 文本预览**: 输入文本查看.9图作为背景的实际效果
- **✅ 格式验证**: 全面的格式检查和错误检测
- **📦 AAPT编译**: 编译为Android系统可识别的格式
- **💾 一键下载**: 下载编译后的.9图文件

### 技术特性
- **🎨 现代化UI**: 基于React和Tailwind CSS的响应式设计
- **🔧 零配置**: 无需安装，直接在浏览器中使用
- **📱 移动友好**: 完美支持桌面端、平板和移动设备
- **🚀 高性能**: 使用Canvas API进行高效的像素级处理
- **🛡️ 类型安全**: 完整的错误处理和用户反馈

## 🚀 在线使用

### 当前可用地址
- **Manus平台**: https://tmusxfvu.manus.space
- **GitHub Pages**: https://aj-designteam.github.io/android-ninepatch-processor/


## 📖 使用指南

### 什么是.9图？

.9图（NinePatch）是Android开发中使用的一种特殊PNG图片格式，通过在图片边缘添加黑色像素标记来定义：
- **拉伸区域**: 图片在缩放时哪些部分可以拉伸
- **内容区域**: 文本或其他内容应该放置在哪里

### 如何制作.9图？

1. **准备原始图片**: 创建你想要的按钮、背景或UI元素
2. **添加拉伸标记**: 
   - 在图片**顶部边缘**添加黑色像素标记水平拉伸区域
   - 在图片**左侧边缘**添加黑色像素标记垂直拉伸区域
3. **添加内容标记**:
   - 在图片**右侧边缘**添加黑色像素标记内容区域的垂直范围
   - 在图片**底部边缘**添加黑色像素标记内容区域的水平范围
4. **确保四角透明**: 图片的四个角必须为透明像素
5. **保存文件**: 文件名必须以`.9.png`结尾

### 使用工具的步骤

1. **上传文件**: 将制作好的.9图拖拽到上传区域或点击选择文件
2. **查看验证结果**: 工具会自动检查格式是否正确
3. **预览效果**: 在预览标签页中查看不同尺寸下的拉伸效果
4. **测试文本**: 输入文本查看实际使用效果
5. **下载编译文件**: 下载可在Android项目中直接使用的编译后文件

## 🛠️ 本地开发

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/your-username/ninepatch-tool.git
cd ninepatch-tool

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览生产版本
pnpm run preview
```

### 项目结构

```
ninepatch-tool/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React组件
│   │   ├── ui/            # UI基础组件 (shadcn/ui)
│   │   ├── FileUploader.jsx
│   │   ├── PreviewPanel.jsx
│   │   └── ValidationPanel.jsx
│   ├── lib/               # 核心库
│   │   ├── pngParser.js   # PNG文件解析
│   │   ├── ninePatchProcessor.js  # .9图处理
│   │   └── previewRenderer.js     # 预览渲染
│   ├── App.jsx            # 主应用组件
│   └── main.jsx           # 应用入口
├── package.json
└── README.md
```

## 🔧 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **UI组件**: shadcn/ui
- **图标库**: Lucide React
- **图像处理**: Canvas API
- **文件处理**: File API

## 📚 API文档

### 核心类

#### PNGParser
PNG文件解析器，用于解析PNG文件结构和chunk数据。

```javascript
// 解析PNG文件
const result = await PNGParser.parseFile(file);
```

#### NinePatchProcessor  
.9图处理器，用于解析源.9图和编译为AAPT格式。

```javascript
// 解析源.9图
const ninePatchInfo = await NinePatchProcessor.parseSourceNinePatch(image, canvas);

// 编译为AAPT格式
const compiled = NinePatchProcessor.compileToAAP(ninePatchInfo);
```

#### PreviewRenderer
预览渲染器，用于渲染.9图的各种预览效果。

```javascript
// 渲染预览
PreviewRenderer.renderPreview(ninePatchInfo, width, height, canvas);

// 渲染文本预览
PreviewRenderer.renderWithText(ninePatchInfo, text, canvas);
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v1.0.0 (2025-01-21)
- ✨ 初始版本发布
- 🎉 完整的.9图处理功能
- 🎨 现代化用户界面
- 📱 响应式设计支持
- ✅ 格式验证和错误检测
- 🔍 实时预览功能

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Android官方文档](https://developer.android.com/guide/topics/graphics/drawables#nine-patch) - .9图规范参考
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的UI组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Lucide](https://lucide.dev/) - 美观的图标库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 微信:thebn915

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

