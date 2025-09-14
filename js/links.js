// 链接管理模块
const Links = {
    // 初始化链接功能
    initLinkFunctions() {
        // 链接编辑表单提交事件
        document.getElementById('linkEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLink();
        });
        
        // 统一的模态框关闭事件处理
        window.addEventListener('click', (event) => {
            const settingsModal = document.getElementById('settingsModal');
            const linkEditModal = document.getElementById('linkEditModal');
            const sectionEditModal = document.getElementById('sectionEditModal');
            
            // 点击页面设置模态框外部关闭
            if (event.target === settingsModal) {
                UI.closeModal('settingsModal');
            }
            
            // 点击链接编辑模态框外部关闭
            if (event.target === linkEditModal) {
                UI.closeModal('linkEditModal');
            }
            
            // 点击分组编辑模态框外部关闭
            if (event.target === sectionEditModal) {
                UI.closeModal('sectionEditModal');
            }
        });
        
        // 模态框关闭事件
        const closeButtons = document.querySelectorAll('.modal .close');
        closeButtons.forEach((button, index) => {
            if (index === 0) { // 页面设置模态框关闭按钮
                button.addEventListener('click', () => {
                    UI.closeModal('settingsModal');
                });
            } else if (index === 1) { // 链接编辑模态框关闭按钮
                button.addEventListener('click', () => {
                    UI.closeModal('linkEditModal');
                });
            } else if (index === 2) { // 分组编辑模态框关闭按钮
                button.addEventListener('click', () => {
                    UI.closeModal('sectionEditModal');
                });
            }
        });
    },
    
    // 绑定编辑和删除事件
    bindEditDeleteEvents() {
        // 编辑链接按钮事件
        document.querySelectorAll('.edit-link-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const linkItem = e.target.closest('.link-item');
                const linkId = linkItem.dataset.linkId;
                
                // 找到对应的链接数据（需要在所有分组中查找）
                let linkData = null;
                let sectionId = null;
                
                for (const section of sectionsData) {
                    const link = section.links.find(l => l.id === linkId);
                    if (link) {
                        linkData = link;
                        sectionId = section.id;
                        break;
                    }
                }
                
                if (linkData && sectionId) {
                    UI.showLinkEditModal(linkData, linkId);
                    document.getElementById('linkEditModal').dataset.currentSectionId = sectionId;
                }
            });
        });
        
        // 删除链接按钮事件
        document.querySelectorAll('.delete-link-btn').forEach(button => {
            // 移除之前可能存在的事件监听器
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button);
            
            // 添加新的事件监听器
            clone.addEventListener('click', (e) => {
                e.stopPropagation();
                const linkItem = e.target.closest('.link-item');
                const linkId = linkItem.dataset.linkId;
                
                if (confirm('确定要删除这个链接吗？')) {
                    // 从数据数组中删除（需要在所有分组中查找）
                    let sectionId = null;
                    for (const section of sectionsData) {
                        const linkIndex = section.links.findIndex(link => link.id === linkId);
                        if (linkIndex !== -1) {
                            section.links.splice(linkIndex, 1);
                            sectionId = section.id;
                            break;
                        }
                    }
                    
                    if (sectionId) {
                        Data.saveSectionsData();
                        Renderer.updateSection(sectionId);
                    }
                }
            });
        });
    },
    
    // 保存链接
    saveLink() {
        const modal = document.getElementById('linkEditModal');
        const url = document.getElementById('editLinkUrl').value;
        const name = document.getElementById('editLinkName').value;
        const icon = document.getElementById('editLinkIcon').value;
        
        // 获取当前分组ID
        const sectionId = modal.dataset.currentSectionId || 'default';
        
        // 找到对应的分组
        const sectionIndex = sectionsData.findIndex(section => section.id === sectionId);
        if (sectionIndex === -1) return;
        
        const sectionLinks = sectionsData[sectionIndex].links;
        
        if (modal.dataset.editMode === 'add') {
            // 添加新链接
            const newLink = {
                id: 'link' + Date.now(),
                url: url,
                name: name,
                icon: icon
            };
            
            sectionLinks.push(newLink);
        } else {
            // 编辑现有链接
            const linkId = modal.dataset.linkId;
            const linkIndex = sectionLinks.findIndex(link => link.id === linkId);
            
            if (linkIndex !== -1) {
                sectionLinks[linkIndex].url = url;
                sectionLinks[linkIndex].name = name;
                sectionLinks[linkIndex].icon = icon;
            }
        }
        
        // 保存数据并局部更新
        Data.saveSectionsData();
        Renderer.updateSection(sectionId);
        
        UI.closeModal('linkEditModal');
    }
};