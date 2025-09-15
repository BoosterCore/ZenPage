// 分组管理模块
// 注意：不再在这里声明 sectionsData，而是在 app.js 中初始化

// 初始化分组数据的函数
function initSectionsData() {
    try {
        if (typeof window.sectionsData === 'undefined') {
            const savedData = localStorage.getItem('sectionsData');
            if (savedData) {
                window.sectionsData = JSON.parse(savedData);
            } else {
                window.sectionsData = [
                    {
                        id: 'section1',
                        title: '常用网站',
                        backgroundColor: '#444444',
                        links: []
                    },
                    {
                        id: 'section2',
                        title: '开发工具',
                        backgroundColor: '#555555',
                        links: []
                    }
                ];
            }
        }
    } catch (error) {
        console.error('初始化分组数据时出错，使用默认数据:', error);
        window.sectionsData = [
            {
                id: 'section1',
                title: '常用网站',
                backgroundColor: '#444444',
                links: []
            }
        ];
    }
}

const Sections = {
    // 添加新分组
    addSection() {
        const newSection = {
            id: 'section' + (window.sectionsData.length + 1),
            title: '新分组',
            backgroundColor: '#444444',
            links: []
        };
        
        window.sectionsData.push(newSection);
        localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
            Renderer.renderSections();
        }
    },
    
    // 删除分组
    deleteSection(sectionId) {
        if (window.sectionsData.length <= 1) {
            alert('至少需要保留一个分组！');
            return;
        }
        
        // 使用自定义确认对话框
        if (typeof UI !== 'undefined' && typeof UI.showConfirmModal === 'function') {
            UI.showConfirmModal('确定要删除这个分组吗？分组内的所有链接都将丢失！', function() {
                // 用户点击确定
                window.sectionsData = window.sectionsData.filter(section => section.id !== sectionId);
                localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
                if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                    Renderer.renderSections();
                }
            }, function() {
                // 用户点击取消，不做任何操作
                return;
            });
        }
    },
    
    // 更新分组标题
    updateSectionTitle(sectionId, newTitle) {
        const section = window.sectionsData.find(s => s.id === sectionId);
        if (section) {
            section.title = newTitle;
            localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
        }
    },
    
    // 更新分组背景色
    updateSectionBackgroundColor(sectionId, newColor) {
        const section = window.sectionsData.find(s => s.id === sectionId);
        if (section) {
            section.backgroundColor = newColor;
            // 计算并保存按钮颜色
            section.linkButtonColor = Utils.lightenColor(newColor, 20);
            localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
            
            // 更新UI中的分组背景色
            const sectionElement = document.querySelector(`.links-section[data-section-id="${sectionId}"]`);
            if (sectionElement) {
                sectionElement.style.backgroundColor = Utils.convertToRGBA(newColor, 0.25);
                
                // 更新该分组内链接按钮的样式
                if (typeof Styles !== 'undefined' && typeof Styles.updateSectionLinkButtonStyle === 'function') {
                    Styles.updateSectionLinkButtonStyle(sectionId, section.linkButtonColor);
                }
            }
        }
    },
    
    // 处理分组编辑表单提交
    handleSectionEditSubmit(e) {
        e.preventDefault();
        
        const modal = document.getElementById('sectionEditModal');
        const titleInput = document.getElementById('editSectionTitle');
        const colorInput = document.getElementById('editSectionBgColor');
        
        const sectionId = modal.dataset.sectionId;
        const isEditMode = modal.dataset.editMode === 'edit';
        
        if (isEditMode && sectionId) {
            // 更新分组
            Sections.updateSectionTitle(sectionId, titleInput.value);
            Sections.updateSectionBackgroundColor(sectionId, colorInput.value);
        } else {
            // 添加新分组
            const newSection = {
                id: 'section' + (window.sectionsData.length + 1),
                title: titleInput.value,
                backgroundColor: colorInput.value,
                links: []
            };
            
            window.sectionsData.push(newSection);
            localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
        }
        
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
            Renderer.renderSections();
        }
        if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') {
            UI.closeModal('sectionEditModal');
        }
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化分组数据
    initSectionsData();
    
    // 确保初始数据存在
    if (!localStorage.getItem('sectionsData')) {
        localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
    }
});