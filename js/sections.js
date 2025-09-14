// 分组管理模块
const Sections = {
    // 初始化分组功能
    initSectionFunctions() {
        // 添加分组按钮事件
        document.getElementById('addSectionBtn').addEventListener('click', () => {
            if (isEditMode) {
                UI.showSectionEditModal(null);
            }
        });
        
        // 分组编辑表单提交事件
        document.getElementById('sectionEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSection();
        });
        
        // 删除分组按钮事件
        document.getElementById('deleteSectionBtn').addEventListener('click', () => {
            const modal = document.getElementById('sectionEditModal');
            const sectionId = modal.dataset.sectionId;
            
            // 不能删除最后一个分组
            if (sectionsData.length <= 1) {
                alert('至少需要保留一个分组！');
                return;
            }
            
            if (sectionId && confirm('确定要删除这个分组吗？此操作不可恢复！')) {
                // 找到要删除的分组索引
                const sectionIndex = sectionsData.findIndex(section => section.id === sectionId);
                
                if (sectionIndex !== -1) {
                    // 删除分组
                    sectionsData.splice(sectionIndex, 1);
                    
                    // 保存数据并局部更新
                    Data.saveSectionsData();
                    Renderer.removeSectionElement(sectionId);
                    
                    // 关闭模态框
                    UI.closeModal('sectionEditModal');
                }
            }
        });
    },
    
    // 保存分组
    saveSection() {
        const modal = document.getElementById('sectionEditModal');
        const title = document.getElementById('editSectionTitle').value;
        const bgColor = document.getElementById('editSectionBgColor').value;
        
        if (modal.dataset.editMode === 'add') {
            // 添加新分组
            const newSection = {
                id: 'section' + Date.now(),
                title: title,
                bgColor: bgColor,
                links: []
            };
            
            sectionsData.push(newSection);
            
            // 保存数据并局部添加分组
            Data.saveSectionsData();
            Renderer.addSectionElement(newSection);
        } else {
            // 编辑现有分组
            const sectionId = modal.dataset.sectionId;
            const sectionIndex = sectionsData.findIndex(section => section.id === sectionId);
            
            if (sectionIndex !== -1) {
                sectionsData[sectionIndex].title = title;
                sectionsData[sectionIndex].bgColor = bgColor;
                
                // 更新该分组内链接按钮颜色
                const lighterColor = Utils.lightenColor(bgColor, 20);
                Styles.updateSectionLinkButtonStyle(sectionId, lighterColor);
                sectionsData[sectionIndex].linkButtonColor = lighterColor;
                
                // 保存数据并局部更新分组
                Data.saveSectionsData();
                Renderer.updateSection(sectionId);
            }
        }
        
        UI.closeModal('sectionEditModal');
    }
};