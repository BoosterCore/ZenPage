// 全局变量
let isEditMode = false;
let sectionsData = [
    {
        id: 'search-engines',
        title: '搜索引擎',
        bgColor: 'rgba(68, 68, 68, 0.25)',
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
        bgColor: 'rgba(68, 68, 68, 0.25)',
        links: [
            { id: 'link6', url: 'https://www.jd.com', name: '京东', icon: '🛒' },
            { id: 'link7', url: 'https://www.taobao.com', name: '淘宝', icon: '🛍️' },
            { id: 'link8', url: 'https://www.goofish.com', name: '闲鱼', icon: '🐟' }
        ]
    }
];

// 拖拽相关变量
let dragSrcElement = null;

// 数据管理模块
const Data = {
    // 加载分组数据
    loadSectionsData() {
        const savedSections = localStorage.getItem('sectionsData');
        if (savedSections) {
            sectionsData = JSON.parse(savedSections);
        }
        Renderer.renderSections();
    },
    
    // 保存分组数据
    saveSectionsData() {
        localStorage.setItem('sectionsData', JSON.stringify(sectionsData));
    }
};