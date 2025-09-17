// stateManager.js - 状态管理模块
class StateManager {
    constructor() {
        // 初始化状态对象
        this.state = {
            sectionsData: [],
            isEditMode: false,
            currentPageSettings: {
                title: '我要去冲浪！',
                backgroundColor: '#333333'
            }
        };
        
        // 初始化监听器数组
        this.listeners = [];
    }
    
    // 获取当前状态
    getState() {
        return { ...this.state };
    }
    
    // 更新状态
    updateState(updates) {
        // 合并新状态
        this.state = { ...this.state, ...updates };
        
        // 通知所有监听器
        this.notifyListeners();
        
        // 保存到本地存储
        this.saveToStorage();
    }
    
    // 订阅状态变化
    subscribe(listener) {
        // 添加监听器
        if (typeof listener === 'function') {
            this.listeners.push(listener);
        }
    }
    
    // 取消订阅
    unsubscribe(listener) {
        // 过滤掉要移除的监听器
        this.listeners = this.listeners.filter(l => l !== listener);
    }
    
    // 通知所有监听器
    notifyListeners() {
        // 遍历所有监听器并调用
        this.listeners.forEach(listener => {
            try {
                listener(this.getState());
            } catch (error) {
                console.error('调用监听器时出错:', error);
            }
        });
    }
    
    // 保存状态到本地存储
    saveToStorage() {
        try {
            // 将状态对象转换为JSON字符串并保存
            localStorage.setItem('state', JSON.stringify(this.state));
        } catch (error) {
            console.error('保存状态到本地存储时出错:', error);
        }
    }
    
    // 从本地存储加载状态
    loadFromStorage() {
        try {
            // 从本地存储获取状态
            const storedState = localStorage.getItem('state');
            
            // 如果有存储的状态，则解析并应用
            if (storedState) {
                const parsedState = JSON.parse(storedState);
                
                // 验证解析后的状态格式是否正确
                if (typeof parsedState === 'object' && parsedState !== null) {
                    // 合并解析后的状态
                    this.state = { ...this.state, ...parsedState };
                }
            }
        } catch (error) {
            console.error('从本地存储加载状态时出错:', error);
        }
    }
}

// 创建全局状态管理器实例
const stateManager = new StateManager();