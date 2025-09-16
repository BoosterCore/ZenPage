// data.js - 数据管理模块
// 数据管理模块
const Data = {
    // 加载分组数据
    loadSectionsData() {
        try {
            const savedSections = localStorage.getItem('sectionsData');
            let sectionsData;
            
            if (savedSections) {
                sectionsData = JSON.parse(savedSections);
                
                // 验证并修复数据结构
                if (Array.isArray(sectionsData)) {
                    sectionsData.forEach((section, index) => {
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
                    sectionsData = this.getDefaultSectionsData();
                }
            } else {
                // 如果localStorage中没有数据，则使用默认数据
                sectionsData = this.getDefaultSectionsData();
            }
            
            // 更新状态管理器中的数据
            stateManager.updateState({ sectionsData });
        } catch (e) {
            ErrorHandler.handle(e, '加载分组数据');
            // 出错时使用默认数据
            stateManager.updateState({ sectionsData: this.getDefaultSectionsData() });
        }
        
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
            Renderer.renderSections();
        }
    },
    
    // 获取默认分组数据
    getDefaultSectionsData() {
        return [
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
    },
    
    // 保存分组数据
    saveSectionsData() {
        try {
            const sectionsData = DataAPI.getSections();
            // 在保存前验证数据结构
            if (Array.isArray(sectionsData)) {
                const validData = sectionsData.map(section => ({
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
            ErrorHandler.handle(e, '保存分组数据');
        }
    }
};