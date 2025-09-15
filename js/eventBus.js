// eventBus.js - 事件总线模块
class EventBus {
    constructor() {
        this.events = {};
    }
    
    // 订阅事件
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    // 发布事件
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    // 取消订阅
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

// 创建全局事件总线实例
const eventBus = new EventBus();