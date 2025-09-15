// links.js - 链接管理模块
const Links = {
    // 绑定编辑和删除事件
    bindEditDeleteEvents() {
        // 为每个编辑链接按钮绑定事件
        document.querySelectorAll('.edit-link-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const linkItem = this.closest('.link-item');
                const sectionElement = this.closest('.links-section');
                const sectionId = sectionElement.dataset.sectionId;
                
                // 查找对应的链接数据
                const sectionsData = DataAPI.getSections();
                const section = sectionsData.find(s => s.id === sectionId);
                if (section) {
                    // 获取链接索引
                    const linkItems = Array.from(sectionElement.querySelectorAll('.link-item:not(:has(.add-link-placeholder))'));
                    const linkIndex = linkItems.indexOf(linkItem);
                    if (linkIndex >= 0 && linkIndex < section.links.length) {
                        const linkData = section.links[linkIndex];
                        const linkId = `${sectionId}-${linkIndex}`;
                        if (typeof UI !== 'undefined' && typeof UI.showLinkEditModal === 'function') {
                            UI.showLinkEditModal(linkData, linkId);
                        }
                    }
                }
            });
        });
        
        // 为每个删除链接按钮绑定事件
        document.querySelectorAll('.delete-link-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const linkItem = this.closest('.link-item');
                const sectionElement = this.closest('.links-section');
                const sectionId = sectionElement.dataset.sectionId;
                
                // 使用自定义确认对话框
                if (typeof UI !== 'undefined' && typeof UI.showConfirmModal === 'function') {
                    UI.showConfirmModal('确定要删除这个链接吗？', function() {
                        // 用户点击确定
                        const sectionsData = DataAPI.getSections();
                        const section = sectionsData.find(s => s.id === sectionId);
                        if (section) {
                            // 获取链接索引
                            const linkItems = Array.from(sectionElement.querySelectorAll('.link-item:not(:has(.add-link-placeholder))'));
                            const linkIndex = linkItems.indexOf(linkItem);
                            if (linkIndex >= 0 && linkIndex < section.links.length) {
                                section.links.splice(linkIndex, 1);
                                DataAPI.updateSections(sectionsData);
                                Data.saveSectionsData();
                                if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                                    Renderer.renderSections();
                                }
                            }
                        }
                    }, function() {
                        // 用户点击取消，不做任何操作
                        return;
                    });
                }
            });
        });
        
        // 为每个分组标题绑定事件
        document.querySelectorAll('.section-title[contenteditable]').forEach(title => {
            title.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });
            
            title.addEventListener('blur', function() {
                const sectionElement = this.closest('.links-section');
                const sectionId = sectionElement.dataset.sectionId;
                const newTitle = this.textContent;
                
                // 更新分组标题
                const sectionsData = DataAPI.getSections();
                const section = sectionsData.find(s => s.id === sectionId);
                if (section) {
                    section.title = newTitle;
                    DataAPI.updateSections(sectionsData);
                    Data.saveSectionsData();
                }
            });
        });
    },
    
    // 处理链接编辑表单提交
    handleLinkEditSubmit(e) {
        e.preventDefault();
        
        const modal = document.getElementById('linkEditModal');
        const urlInput = document.getElementById('editLinkUrl');
        const nameInput = document.getElementById('editLinkName');
        const iconInput = document.getElementById('editLinkIcon');
        
        const isEditMode = modal.dataset.editMode === 'edit';
        const linkId = modal.dataset.linkId;
        const sectionId = modal.dataset.currentSectionId;
        
        if (isEditMode && linkId) {
            // 编辑现有链接
            const [secId, linkIndex] = linkId.split('-');
            const sectionsData = DataAPI.getSections();
            const section = sectionsData.find(s => s.id === secId);
            if (section) {
                section.links[parseInt(linkIndex)] = {
                    url: urlInput.value,
                    name: nameInput.value,
                    icon: iconInput.value
                };
                DataAPI.updateSections(sectionsData);
                Data.saveSectionsData();
            }
        } else if (sectionId) {
            // 添加新链接
            const sectionsData = DataAPI.getSections();
            const section = sectionsData.find(s => s.id === sectionId);
            if (section) {
                section.links = section.links || [];
                section.links.push({
                    url: urlInput.value,
                    name: nameInput.value,
                    icon: iconInput.value
                });
                DataAPI.updateSections(sectionsData);
                Data.saveSectionsData();
            }
        }
        
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
            Renderer.renderSections();
        }
        if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') {
            UI.closeModal('linkEditModal');
        }
    }
};