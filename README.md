# ZenPage

这是一个实验性的项目，由不会编程的设计师通过和Lingma与Trae这两款AI IDE对话，生成的功能比较完整的个人导航页面，具有以下特性：

This is an experimental project created by a designer who doesn't know programming, through conversations with Tongyi Qianwen AI, generating a relatively complete personal navigation page with the following features:

## 项目演示 (Project Demo)：
   https://boostercore.github.io/ZenPage

## 功能特点 (Features)

- **分组管理**：可以创建、编辑、删除链接分组  
  **Group Management**: Create, edit, and delete link groups

- **链接管理**：可以添加、编辑、删除链接，支持自定义图标  
  **Link Management**: Add, edit, and delete links with support for custom icons

- **拖拽排序**：支持分组和链接的拖拽排序  
  **Drag and Drop Sorting**: Support for drag-and-drop sorting of groups and links

- **样式定制**：可以自定义页面标题、字体、颜色等样式  
  **Style Customization**: Customize page title, fonts, colors, and other styles

- **数据持久化**：使用浏览器本地存储保存所有设置  
  **Data Persistence**: Uses browser local storage to save all settings

- **导入导出**：支持配置的导入和导出功能  
  **Import/Export**: Support for importing and exporting configurations

- **响应式设计**：适配各种屏幕尺寸  
  **Responsive Design**: Adapts to various screen sizes

- **UI幻化**：通过上传图片自动提取配色方案并应用到页面  
  **UI Magic**: Automatically extract color schemes from uploaded images and apply them to the page

## 使用方法 (Usage)

1. 打开 index.html 文件即可使用  
   Open the index.html file to use

2. 点击"编辑模式"按钮进入编辑状态  
   Click the "Edit Mode" button to enter editing mode

3. 在编辑模式下可以：  
   In editing mode you can:
   - 添加/编辑/删除分组  
     Add/edit/delete groups
   - 添加/编辑/删除链接  
     Add/edit/delete links
   - 拖拽排序分组  
     Drag to sort groups
   - 自定义页面样式  
     Customize page styles

4. 点击页面标题可进行页面设置  
   Click the page title to access page settings

5. 使用导入/导出功能备份和恢复配置  
   Use import/export functions to backup and restore configurations

6. 使用UI幻化功能自动配色  
   Use UI Magic feature for automatic color scheme generation:
   - 在页面设置中找到"UI幻化"部分  
     Find the "UI Magic" section in page settings
   - 上传一张图片  
     Upload an image
   - 系统将自动分析图片并提取主要颜色  
     The system will automatically analyze the image and extract main colors
   - 点击"应用配色方案"按钮应用提取的配色  
     Click the "Apply Color Scheme" button to apply the extracted colors

## 技术架构 (Technical Architecture)

项目采用原生HTML、CSS、JavaScript开发，无外部依赖。

The project is developed using native HTML, CSS, and JavaScript with no external dependencies.

## 文件说明 (File Descriptions)

### CSS文件 (CSS Files)
- [main.css] - 主要样式（Main styles）
- [modals.css] - 模态框样式（Modal styles）
- [responsive.css] - 响应式样式（Responsive styles）

### JavaScript文件 (JavaScript Files)
- [app.js] - 应用主入口（Application entry point）
- [data.js] - 数据管理模块（Data management module）
- [renderer.js] - 渲染模块（Rendering module）
- [ui.js] - UI交互模块（UI interaction module）
- [styles.js] - 样式管理模块（Style management module）
- [links.js] - 链接管理模块（Link management module）
- [sections.js] - 分组管理模块（Group management module）
- [dragdrop.js] - 拖拽管理模块（Drag and drop management module）
- [utils.js] - 工具函数模块（Utility functions module）
- [uiMagic.js] - UI幻化功能模块（UI Magic feature module）
- [eventBus.js] - 事件总线模块（Event bus module）
- [stateManager.js] - 状态管理模块（State management module）
- [dataAPI.js] - 数据API模块（Data API module）
