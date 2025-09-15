// stateManager.js - 状态管理模块
class StateManager {
    constructor() {
        this.state = {
            sectionsData: [],
            isEditMode: false,
            currentPageSettings: {
                title: '我要去冲浪！',
                backgroundColor: '#333333'
            }
        };
        this.listeners = [];
    }
    
    // 获取状态
    getState() {
        return {...this.state};
    }
    
    // 更新状态
    updateState(updates) {
        this.state = {...this.state, ...updates};
        this.notifyListeners();
        this.saveToStorage();
    }
    
    // 订阅状态变化
    subscribe(listener) {
        this.listeners.push(listener);
    }
    
    // 通知监听器
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
    
    // 保存到本地存储
    saveToStorage() {
        try {
            localStorage.setItem('sectionsData', JSON.stringify(this.state.sectionsData));
            localStorage.setItem('pageTitle', this.state.currentPageSettings.title);
            localStorage.setItem('isEditMode', this.state.isEditMode.toString());
        } catch (e) {
            console.error('保存数据到localStorage时出错:', e);
        }
    }
    
    // 从存储加载
    loadFromStorage() {
        try {
            const sections = localStorage.getItem('sectionsData');
            const title = localStorage.getItem('pageTitle');
            const isEditMode = localStorage.getItem('isEditMode');
            
            if (sections) {
                this.state.sectionsData = JSON.parse(sections);
            }
            
            if (title) {
                this.state.currentPageSettings.title = title;
            }
            
            if (isEditMode) {
                this.state.isEditMode = isEditMode === 'true';
            }
        } catch (e) {
            console.error('从localStorage加载数据时出错:', e);
        }
    }
}

// 创建全局状态管理器实例
const stateManager = new StateManager();