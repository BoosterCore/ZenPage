// errorHandler.js - 错误处理模块
const ErrorHandler = {
    handle(error, context) {
        console.error(`Error in ${context}:`, error);
        // 可以添加用户友好的错误提示
        if (typeof UI !== 'undefined' && typeof UI.showMessage === 'function') {
            UI.showMessage('操作失败，请重试', 'error');
        }
    }
};