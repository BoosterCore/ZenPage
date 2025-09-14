// 模块化组织代码
const App = {
    // 应用初始化
    init() {
        window.addEventListener('load', () => {
            const savedTitle = localStorage.getItem('pageTitle');
            if (savedTitle) {
                document.getElementById('pageTitle').innerText = savedTitle;
            }
            
            // 恢复分组数据
            Data.loadSectionsData();
            
            // 恢复保存的样式设置
            Styles.loadTitleStyles();
            
            // 初始化设置面板事件
            UI.initSettingsPanel();
            
            // 初始化编辑模式切换
            UI.initEditModeToggle();
            
            // 初始化链接功能
            Links.initLinkFunctions();
            
            // 初始化分组功能
            Sections.initSectionFunctions();
            
            // 初始化导入/导出功能
            UI.initImportExportFunctions();
            
            // 创建模态框背景遮罩
            UI.createModalBackdrop();
        });
    }
};

// 初始化应用
App.init();