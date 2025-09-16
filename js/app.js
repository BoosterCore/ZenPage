// app.js - 应用主入口文件 (部分修改)
document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行确保所有模块都已加载
    setTimeout(function() {
        try {
            // 初始化状态管理器
            stateManager.loadFromStorage();
            
            // 恢复页面设置（包括背景色）
            try {
                // 恢复页面标题
                const savedTitle = DataAPI.getPageTitle();
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle && savedTitle) {
                    pageTitle.textContent = savedTitle;
                }
                
                // 恢复页面背景
                const savedBgGradient = localStorage.getItem('pageBgGradient');
                if (savedBgGradient) {
                    document.body.style.background = savedBgGradient;
                } else {
                    // 如果没有保存的渐变，但有背景色，也恢复它
                    const savedBgColor = localStorage.getItem('pageBgColor');
                    if (savedBgColor) {
                        const savedAngle = localStorage.getItem('gradientAngle') || '90';
                        const gradient = Utils.generateGradientFromColor(savedBgColor, savedAngle);
                        document.body.style.background = gradient;
                    }
                }
                
                // 恢复标题样式
                const pageTitleElement = document.getElementById('pageTitle');
                if (pageTitleElement) {
                    const savedFontFamily = localStorage.getItem('titleFontFamily');
                    const savedFontSize = localStorage.getItem('titleFontSize');
                    const savedFontColor = localStorage.getItem('titleFontColor');
                    
                    if (savedFontFamily) pageTitleElement.style.fontFamily = savedFontFamily;
                    if (savedFontSize) pageTitleElement.style.fontSize = savedFontSize + 'px';
                    if (savedFontColor) pageTitleElement.style.color = savedFontColor;
                }
            } catch (e) {
                // 直接使用 console.error 而不是 ErrorHandler
                console.error('恢复页面设置时出错:', e);
            }
            
            // 初始化分组数据
            if (typeof Data !== 'undefined' && typeof Data.loadSectionsData === 'function') {
                Data.loadSectionsData();
            } else if (typeof initSectionsData === 'function') {
                initSectionsData();
            } else {
                // 如果没有数据加载函数，则使用默认数据
                const defaultSectionsData = [
                    {
                        id: 'search-engines',
                        title: '搜索引擎',
                        backgroundColor: '#444444',
                        links: [
                            { id: 'link1', url: 'https://www.google.com', name: 'Google', icon: '🔍' },
                            { id: 'link2', url: 'https://www.bing.com', name: 'Bing', icon: '🔍' },
                            { id: 'link3', url: 'https://www.yahoo.com', name: 'Yahoo', icon: '🔍' },
                            { id: 'link4', url: 'https://www.sogou.com', name: '搜狗', icon: '🔍' },
                            { id: 'link5', url: 'https://www.baidu.com', name: '百度', icon: '🔍' }
                        ]
                    },
                    {
                        id: 'shopping',
                        title: '购物商城',
                        backgroundColor: '#555555',
                        links: [
                            { id: 'link6', url: 'https://www.amazon.com', name: '亚马逊', icon: '🛒' },
                            { id: 'link7', url: 'https://www.jd.com', name: '京东', icon: '🛒' },
                            { id: 'link8', url: 'https://www.taobao.com', name: '淘宝', icon: '🛒' },
                            { id: 'link9', url: 'https://www.tmall.com', name: '天猫', icon: '🛒' },
                            { id: 'link10', url: 'https://www.goofish.com', name: '闲鱼', icon: '🐟' }
                        ]
                    }
                ];
                
                // 确保window.sectionsData存在
                if (DataAPI.getSections().length === 0) {
                    stateManager.updateState({ sectionsData: defaultSectionsData });
                }
                
                // 渲染分组
                if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                    Renderer.renderSections();
                }
            }
            
            // 绑定链接编辑和删除事件
            if (typeof Links !== 'undefined' && typeof Links.bindEditDeleteEvents === 'function') {
                Links.bindEditDeleteEvents();
            }
            
            // 绑定分组表单提交事件
            const sectionEditForm = document.getElementById('sectionEditForm');
            if (sectionEditForm && typeof Sections !== 'undefined' && typeof Sections.handleSectionEditSubmit === 'function') {
                sectionEditForm.addEventListener('submit', Sections.handleSectionEditSubmit);
            }
            
            // 绑定链接表单提交事件
            const linkEditForm = document.getElementById('linkEditForm');
            if (linkEditForm && typeof Links !== 'undefined' && typeof Links.handleLinkEditSubmit === 'function') {
                linkEditForm.addEventListener('submit', Links.handleLinkEditSubmit);
            }
            
            // 绑定添加分组按钮事件
            const addSectionBtn = document.getElementById('addSectionBtn');
            if (addSectionBtn) {
                addSectionBtn.addEventListener('click', function() {
                    // 显示分组编辑模态框，传入null表示添加新模式
                    if (typeof UI !== 'undefined' && typeof UI.showSectionEditModal === 'function') {
                        UI.showSectionEditModal(null);
                    }
                });
            }
            
            // 绑定删除分组按钮事件
            const deleteSectionBtn = document.getElementById('deleteSectionBtn');
            if (deleteSectionBtn) {
                deleteSectionBtn.addEventListener('click', function() {
                    const modal = document.getElementById('sectionEditModal');
                    const sectionId = modal.dataset.sectionId;
                    if (sectionId && typeof Sections !== 'undefined' && typeof Sections.deleteSection === 'function') {
                        Sections.deleteSection(sectionId);
                        if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') {
                            UI.closeModal('sectionEditModal');
                        }
                    }
                });
            }
            
            // 绑定模态框关闭事件
            document.querySelectorAll('.modal .close').forEach(closeBtn => {
                closeBtn.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    if (modal && typeof UI !== 'undefined' && typeof UI.closeModal === 'function') {
                        UI.closeModal(modal.id);
                    }
                });
            });
            
            // 点击模态框外部关闭模态框
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') {
                            UI.closeModal(this.id);
                        }
                    }
                });
            });
            
            // 绑定ESC键关闭模态框
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal').forEach(modal => {
                        if (modal.style.display === 'block') {
                            if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') {
                                UI.closeModal(modal.id);
                            }
                        }
                    });
                }
            });
            
            // 初始化拖拽功能
            if (typeof DragDrop !== 'undefined' && typeof DragDrop.initDragAndDrop === 'function') {
                DragDrop.initDragAndDrop();
            }
            
            // 初始化可拖拽模态框
            if (typeof UI !== 'undefined') {
                // 确保设置模态框也可拖拽
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal) {
                    // 为设置模态框添加打开事件监听器
                    const pageTitle = document.getElementById('pageTitle');
                    if (pageTitle) {
                        pageTitle.addEventListener('click', function(e) {
                            if (DataAPI.isEditMode()) {
                                settingsModal.style.display = 'block';
                                UI.showBodyBlur();
                                UI.makeModalDraggable(settingsModal);
                            }
                        });
                    }
                }
            }
        } catch (error) {
            // 直接使用 console.error 而不是 ErrorHandler
            console.error('应用初始化时出错:', error);
        }
    }, 200); // 延迟200毫秒确保所有模块都已加载

    // 确保页面标题可以点击以打开设置面板
    setTimeout(function() {
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.style.cursor = 'pointer';
        }
    }, 500);
});