// sections.js - 分组管理模块
// 注意：不再在这里声明 sectionsData，而是在 app.js 中初始化

// 初始化分组数据的函数
function initSectionsData() {
    try {
        if (DataAPI.getSections().length === 0) {
            const savedData = localStorage.getItem('sectionsData');
            if (savedData) {
                stateManager.updateState({ sectionsData: JSON.parse(savedData) });
            } else {
                // 使用Data模块的默认数据
                const defaultData = typeof Data !== 'undefined' && typeof Data.getDefaultSectionsData === 'function' 
                    ? Data.getDefaultSectionsData() 
                    : [
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
                        },
                        {
                            id: 'videos',
                            title: '精彩视频',
                            backgroundColor: '#666666',
                            links: [
                                { id: 'link11', url: 'https://www.youtube.com', name: 'Youtube', icon: '▶️' },
                                { id: 'link12', url: 'https://www.bilibili.com', name: 'Bilibili', icon: '📺' },
                                { id: 'link13', url: 'https://www.youku.com', name: '优酷', icon: '🎬' },
                                { id: 'link15', url: 'https://www.iqiyi.com', name: '爱奇艺', icon: '🥝' },
                                { id: 'link16', url: 'https://v.qq.com', name: '腾讯视频', icon: '🐧' },
                                { id: 'link18', url: 'https://www.miguvideo.com', name: '咪咕视频', icon: '🎵' },
                                { id: 'link19', url: 'https://www.dailymotion.com', name: 'Daily motion', icon: '🎥' },
                                { id: 'link20', url: 'https://vimeo.com', name: 'Vimeo', icon: '🎞️' },
                                { id: 'link21', url: 'https://www.netflix.com', name: 'Netflix', icon: '🔴' },
                                { id: 'link22', url: 'https://www.disneyplus.com', name: 'Disney', icon: '🐭' },
                                { id: 'link23', url: 'https://www.hulu.com', name: 'Hulu', icon: ' Hulu' },
                                { id: 'link24', url: 'https://www.hbo.com', name: 'HBO', icon: ' H' },
                                { id: 'link26', url: 'https://www.twitch.tv', name: 'Twitch', icon: '⚡' },
                                { id: 'link27', url: 'https://www.ign.com', name: 'IGN', icon: '🔥' }
                            ]
                        }
                    ];
                stateManager.updateState({ sectionsData: defaultData });
            }
        }
    } catch (error) {
        // 直接使用 console.error 而不是 ErrorHandler
        console.error('初始化分组数据时出错:', error);
        const defaultData = typeof Data !== 'undefined' && typeof Data.getDefaultSectionsData === 'function' 
            ? Data.getDefaultSectionsData() 
            : [
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
                },
                {
                    id: 'videos',
                    title: '精彩视频',
                    backgroundColor: '#666666',
                    links: [
                        { id: 'link11', url: 'https://www.youtube.com', name: 'Youtube', icon: '▶️' },
                        { id: 'link12', url: 'https://www.bilibili.com', name: 'Bilibili', icon: '📺' },
                        { id: 'link13', url: 'https://www.youku.com', name: '优酷', icon: '🎬' },
                        { id: 'link15', url: 'https://www.iqiyi.com', name: '爱奇艺', icon: '🥝' },
                        { id: 'link16', url: 'https://v.qq.com', name: '腾讯视频', icon: '🐧' },
                        { id: 'link18', url: 'https://www.miguvideo.com', name: '咪咕视频', icon: '🎵' },
                        { id: 'link19', url: 'https://www.dailymotion.com', name: 'Daily motion', icon: '🎥' },
                        { id: 'link20', url: 'https://vimeo.com', name: 'Vimeo', icon: '🎞️' },
                        { id: 'link21', url: 'https://www.netflix.com', name: 'Netflix', icon: '🔴' },
                        { id: 'link22', url: 'https://www.disneyplus.com', name: 'Disney', icon: '🐭' },
                        { id: 'link23', url: 'https://www.hulu.com', name: 'Hulu', icon: ' Hulu' },
                        { id: 'link24', url: 'https://www.hbo.com', name: 'HBO', icon: ' H' },
                        { id: 'link26', url: 'https://www.twitch.tv', name: 'Twitch', icon: '⚡' },
                        { id: 'link27', url: 'https://www.ign.com', name: 'IGN', icon: '🔥' }
                    ]
                }
            ];
        stateManager.updateState({ sectionsData: defaultData });
    }
}

const Sections = {
    // 添加新分组
    addSection() {
        const sectionsData = DataAPI.getSections();
        const newSection = {
            id: 'section' + (sectionsData.length + 1),
            title: '新分组',
            backgroundColor: '#444444',
            links: []
        };
        
        DataAPI.addSection(newSection);
        Data.saveSectionsData();
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
            Renderer.renderSections();
        }
    },
    
    // 删除分组
    deleteSection(sectionId) {
        const sectionsData = DataAPI.getSections();
        if (sectionsData.length <= 1) {
            // 使用UI.showMessage显示错误信息，而不是alert
            if (typeof UI !== 'undefined' && typeof UI.showMessage === 'function') {
                UI.showMessage('至少需要保留一个分组！', 'error');
            } else {
                alert('至少需要保留一个分组！');
            }
            return;
        }
        
        // 使用自定义确认对话框
        if (typeof UI !== 'undefined' && typeof UI.showConfirmModal === 'function') {
            UI.showConfirmModal('确定要删除这个分组吗？分组内的所有链接都将丢失！', function() {
                // 用户点击确定
                try {
                    DataAPI.deleteSection(sectionId);
                    Data.saveSectionsData();
                    if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                        Renderer.renderSections();
                    }
                    // 显示成功消息
                    if (typeof UI !== 'undefined' && typeof UI.showMessage === 'function') {
                        UI.showMessage('分组已成功删除', 'success');
                    }
                } catch (error) {
                    // 使用错误处理器处理删除失败的情况
                    if (typeof ErrorHandler !== 'undefined' && typeof ErrorHandler.handle === 'function') {
                        ErrorHandler.handle(error, '删除分组');
                    }
                }
            }, function() {
                // 用户点击取消，不做任何操作
                return;
            });
        } else {
            // 降级处理：如果没有自定义确认对话框，使用默认的confirm
            if (confirm('确定要删除这个分组吗？分组内的所有链接都将丢失！')) {
                try {
                    DataAPI.deleteSection(sectionId);
                    Data.saveSectionsData();
                    if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                        Renderer.renderSections();
                    }
                } catch (error) {
                    console.error('删除分组时出错:', error);
                    alert('删除分组失败，请重试');
                }
            }
        }
    },
    
    // 更新分组标题
    updateSectionTitle(sectionId, newTitle) {
        DataAPI.updateSection(sectionId, { title: newTitle });
        Data.saveSectionsData();
    },
    
    // 更新分组背景色
    updateSectionBackgroundColor(sectionId, newColor) {
        const linkButtonColor = Utils.lightenColor(newColor, 20);
        DataAPI.updateSection(sectionId, { 
            backgroundColor: newColor,
            linkButtonColor: linkButtonColor
        });
        Data.saveSectionsData();
        
        // 更新UI中的分组背景色
        const sectionElement = document.querySelector(`.links-section[data-section-id="${sectionId}"]`);
        if (sectionElement) {
            sectionElement.style.backgroundColor = Utils.convertToRGBA(newColor, 0.25);
            
            // 更新该分组内链接按钮的样式
            if (typeof Styles !== 'undefined' && typeof Styles.updateSectionLinkButtonStyle === 'function') {
                Styles.updateSectionLinkButtonStyle(sectionId, linkButtonColor);
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
            const sectionsData = DataAPI.getSections();
            const newSection = {
                id: 'section' + (sectionsData.length + 1),
                title: titleInput.value,
                backgroundColor: colorInput.value,
                links: []
            };
            
            DataAPI.addSection(newSection);
            Data.saveSectionsData();
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
        Data.saveSectionsData();
    }
});