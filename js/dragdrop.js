// dragdrop.js - 拖拽管理模块
const DragDrop = {
    // 初始化拖拽和排序功能
    initDragAndDrop() {
        // 先清理之前的事件监听器
        this.cleanupDragAndDrop();
        
        // 为每个分组添加拖拽事件
        document.querySelectorAll('.links-section').forEach(section => {
            section.setAttribute('draggable', 'true');
            
            section.addEventListener('dragstart', this.handleDragStart.bind(this));
            section.addEventListener('dragover', this.handleDragOver.bind(this));
            section.addEventListener('dragenter', this.handleDragEnter.bind(this));
            section.addEventListener('dragleave', this.handleDragLeave.bind(this));
            section.addEventListener('drop', this.handleDrop.bind(this));
            section.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
    },
    
    // 清理拖拽功能
    cleanupDragAndDrop() {
        document.querySelectorAll('.links-section').forEach(section => {
            section.setAttribute('draggable', 'false');
            section.classList.remove('drag-over', 'dragging');
            
            // 移除所有可能的拖拽事件监听器
            section.removeEventListener('dragstart', this.handleDragStart, false);
            section.removeEventListener('dragover', this.handleDragOver, false);
            section.removeEventListener('dragenter', this.handleDragEnter, false);
            section.removeEventListener('dragleave', this.handleDragLeave, false);
            section.removeEventListener('drop', this.handleDrop, false);
            section.removeEventListener('dragend', this.handleDragEnd, false);
        });
        
        // 重置拖拽源元素
        this.dragSrcElement = null;
    },
    
    // 拖拽开始
    handleDragStart(e) {
        this.dragSrcElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    },
    
    // 拖拽经过
    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    },
    
    // 拖拽进入
    handleDragEnter(e) {
        if (e.target !== this.dragSrcElement) {
            e.target.classList.add('drag-over');
        }
    },
    
    // 拖拽离开
    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    },
    
    // 拖拽放置
    handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        
        if (this.dragSrcElement !== e.target) {
            // 获取源分组和目标分组的索引
            const sections = Array.from(document.querySelectorAll('.links-section'));
            const srcIndex = sections.indexOf(this.dragSrcElement);
            const targetIndex = sections.indexOf(e.target);
            
            if (srcIndex !== -1 && targetIndex !== -1) {
                // 重新排列数据
                const sectionsData = DataAPI.getSections();
                const [movedSection] = sectionsData.splice(srcIndex, 1);
                sectionsData.splice(targetIndex, 0, movedSection);
                
                // 保存并重新渲染
                DataAPI.updateSections(sectionsData);
                Data.saveSectionsData();
                if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                    Renderer.renderSections();
                }
            }
        }
        
        return false;
    },
    
    // 拖拽结束
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.links-section').forEach(section => {
            section.classList.remove('drag-over');
        });
        this.dragSrcElement = null;
    }
};