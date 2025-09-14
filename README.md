# HTTP Header Modifier

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

一个功能强大的Chrome浏览器插件，允许用户自定义修改HTTP请求头信息。

## ✨ 功能特性

- 🛠️ **自定义请求头**：可以修改任何HTTP请求头字段
- ➕ **添加新字段**：支持添加自定义请求头字段  
- 🎛️ **开关控制**：一键开启/关闭插件功能
- ⚡ **实时生效**：修改立即生效，无需重启浏览器
- 💾 **配置管理**：支持配置的导入/导出功能
- 📋 **预设模板**：提供常用请求头快速设置
- 🎨 **友好界面**：简洁直观的用户界面

## 📦 安装方法

### 开发者模式安装

1. 打开Chrome浏览器，在地址栏输入 `chrome://extensions/`
2. 打开右上角的「开发者模式」开关
3. 点击「加载已解压的扩展程序」按钮
4. 选择本插件所在的 `http-header-modifier` 文件夹
5. 插件安装完成，可以在浏览器工具栏看到插件图标

## 🚀 使用说明

### 基本操作

1. **开启/关闭插件**
   - 点击插件图标打开弹出窗口
   - 使用顶部的开关按钮控制插件启用状态
   - 开启时图标显示绿色「ON」标记

2. **添加请求头**
   - 在「头字段名」输入框中输入字段名（如：Content-Type）
   - 在「值」输入框中输入对应的值（如：application/json）
   - 点击「添加」按钮完成添加

3. **修改请求头**
   - 直接在表格中编辑已有的请求头
   - 修改会实时保存

4. **删除请求头**
   - 点击对应请求头右侧的「删除」按钮

### 🎯 预设模板

插件提供了常用的请求头模板，点击即可快速填充：

| 模板名称 | 请求头 | 值 |
|---------|-------|----|
| JSON Content-Type | Content-Type | application/json |
| Form Content-Type | Content-Type | application/x-www-form-urlencoded |
| 中文语言 | Accept-Language | zh-CN,zh;q=0.9 |
| 英文语言 | Accept-Language | en-US,en;q=0.9 |
| Chrome User-Agent | User-Agent | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 |
| Bearer Token | Authorization | Bearer your-token-here |

### 🔧 常见用例

#### API调试
```
Content-Type: application/json
Authorization: Bearer your-token-here
X-API-Key: your-api-key
```

#### 语言切换
```
Accept-Language: zh-CN,zh;q=0.9
```

#### User-Agent模拟
```
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)
```

#### 自定义标识
```
X-Client-Version: 1.0.0
X-Request-ID: unique-request-id
```

### ⚙️ 配置管理

- **保存配置**：点击「保存配置」按钮保存当前设置
- **重置全部**：点击「重置全部」清空所有配置
- **导出配置**：将当前配置导出为JSON文件
- **导入配置**：从JSON文件导入配置

## 🏗️ 技术架构

- **Chrome Extension Manifest V3** - 使用最新的Chrome扩展规范
- **Declarative Net Request API** - 通过声明式网络请求API拦截和修改请求
- **Chrome Storage API** - 使用同步存储API保存配置数据
- **Vanilla JavaScript** - 纯JavaScript实现，无外部依赖

### 项目结构

```
http-header-modifier/
├── manifest.json          # 插件配置清单
├── background.js          # 后台脚本，处理请求头修改逻辑
├── popup.html             # 弹出窗口HTML结构
├── popup.js               # 弹出窗口交互逻辑
├── popup.css              # 弹出窗口样式
├── README.md              # 详细说明文档
└── icons/                 # 图标文件
    ├── icon16.png         # 16x16图标
    ├── icon48.png         # 48x48图标
    ├── icon128.png        # 128x128图标
    ├── icon-active16.png  # 激活状态16x16图标
    ├── icon-active48.png  # 激活状态48x48图标
    └── icon-active128.png # 激活状态128x128图标
```

## 🔒 安全说明

本插件：
- ❌ 不收集任何用户数据
- ❌ 不发送数据到外部服务器  
- ✅ 所有配置仅存储在本地和Chrome同步存储中
- ❌ 不记录用户的浏览历史
- ✅ 遵循Chrome扩展安全最佳实践

## ⚠️ 注意事项

1. 修改请求头可能会影响网站的正常访问，请谨慎使用
2. 某些安全相关的请求头（如Cookie、Host等）可能受到浏览器限制
3. 插件仅在开启状态下生效，关闭后会恢复原始请求头
4. 配置数据存储在Chrome的同步存储中，可在登录的设备间同步

## 🛠️ 开发

### 本地开发

1. 克隆仓库到本地
2. 在Chrome扩展管理页面加载未打包的扩展程序
3. 选择 `http-header-modifier` 目录
4. 修改代码后重新加载扩展程序即可生效

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🐛 故障排除

### 插件无法生效
1. 确认插件已开启（显示绿色ON标记）
2. 检查是否正确添加了请求头
3. 某些网站可能有特殊限制，尝试在其他网站测试

### 请求头未被修改
1. 某些请求头受浏览器安全策略限制
2. 检查请求头名称和值是否正确
3. 尝试刷新页面或重启浏览器

### 配置丢失
1. 确认已点击「保存配置」按钮
2. 检查Chrome是否登录账号（用于同步）
3. 可以使用导出/导入功能备份配置

## 📝 更新日志

### v1.0.0 (2024-01-13)
- ✨ 初始版本发布
- ✨ 支持请求头的添加、修改、删除
- ✨ 支持配置的导入导出
- ✨ 提供预设模板功能
- ✨ 实现开关控制功能
- ✨ 使用Manifest V3规范

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Chrome Extension API 文档
- Manifest V3 规范
- Declarative Net Request API

## 📞 联系方式

- 📧 问题反馈：[提交Issue](https://github.com/StevenWinsir/http-header-modifier/issues)
- 💬 功能建议：[提交Issue](https://github.com/StevenWinsir/http-header-modifier/issues)
- 🤝 贡献代码：[提交Pull Request](https://github.com/StevenWinsir/http-header-modifier/pulls)

---

⭐ 如果这个项目对你有帮助，请考虑给它一个星标！