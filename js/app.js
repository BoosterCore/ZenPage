// 应用主入口文件
document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行确保所有模块都已加载
    setTimeout(function() {
        // 初始化分组数据
        if (typeof initSectionsData === 'function') {
            initSectionsData();
        }
        
        // 渲染分组
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
            Renderer.renderSections();
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
    }, 200); // 延迟200毫秒确保所有模块都已加载
});

// 确保页面标题可以点击以打开设置面板
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.style.cursor = 'pointer';
        }
    }, 500);
});