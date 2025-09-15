// 全局变量
window.isEditMode = false;

// 默认分组数据
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
        title: '购物',
        backgroundColor: '#555555',
        links: [
            { id: 'link6', url: 'https://www.jd.com', name: '京东', icon: '🛒' },
            { id: 'link7', url: 'https://www.taobao.com', name: '淘宝', icon: '🛍️' },
            { id: 'link8', url: 'https://www.goofish.com', name: '闲鱼', icon: '🐟' }
        ]
    }
];

// 数据管理模块
const Data = {
    // 加载分组数据
    loadSectionsData() {
        try {
            const savedSections = localStorage.getItem('sectionsData');
            if (savedSections) {
                window.sectionsData = JSON.parse(savedSections);
                
                // 验证并修复数据结构
                if (Array.isArray(window.sectionsData)) {
                    window.sectionsData.forEach((section, index) => {
                        // 确保每个分组都有必需的属性
                        if (!section.id) section.id = `section-${Date.now()}-${index}`;
                        if (!section.title) section.title = '未命名分组';
                        if (!section.backgroundColor) section.backgroundColor = '#444444';
                        if (!section.links || !Array.isArray(section.links)) section.links = [];
                        
                        // 确保每个链接都有id属性
                        section.links.forEach((link, linkIndex) => {
                            if (!link.id) {
                                link.id = `${section.id}-link-${linkIndex}`;
                            }
                        });
                    });
                } else {
                    // 如果数据结构不正确，使用默认数据
                    window.sectionsData = JSON.parse(JSON.stringify(defaultSectionsData));
                }
            } else {
                // 如果localStorage中没有数据，则使用默认数据
                window.sectionsData = JSON.parse(JSON.stringify(defaultSectionsData));
            }
        } catch (e) {
            console.error('加载分组数据时出错:', e);
            // 出错时使用默认数据
            window.sectionsData = JSON.parse(JSON.stringify(defaultSectionsData));
        }
        
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
            Renderer.renderSections();
        }
    },
    
    // 保存分组数据
    saveSectionsData() {
        try {
            // 在保存前验证数据结构
            if (Array.isArray(window.sectionsData)) {
                const validData = window.sectionsData.map(section => ({
                    id: section.id || `section-${Date.now()}`,
                    title: section.title || '未命名分组',
                    backgroundColor: section.backgroundColor || '#444444',
                    links: Array.isArray(section.links) ? section.links.map(link => ({
                        id: link.id || `link-${Date.now()}`,
                        url: link.url || '',
                        name: link.name || '未命名链接',
                        icon: link.icon || ''
                    })) : []
                }));
                
                localStorage.setItem('sectionsData', JSON.stringify(validData));
            }
        } catch (e) {
            console.error('保存分组数据时出错:', e);
        }
    }
};