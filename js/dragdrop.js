// dragdrop.js - 拖拽功能模块
const DragDrop = {
    // State management
    dragSrcElement: null,
    dragOverElement: null,
    isLinkDragging: false,
    draggedData: null,
    
    // Link drag handlers
    handleLinkDragStart(e) {
        try {
            this.dragSrcElement = e.target;
            this.isLinkDragging = true;
            
            // 保存被拖拽的链接数据
            const linkId = e.target.dataset.linkId;
            const sectionId = e.target.closest('.links-section').id;
            
            this.draggedData = {
                linkId: linkId,
                sectionId: sectionId
            };
            
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        } catch (e) {
            console.warn('处理链接拖拽开始事件时出错:', e);
        }
    },
    
    handleLinkDragOver(e) {
        try {
            if (e.preventDefault) {
                e.preventDefault();
            }
            
            // Find valid target
            const targetLink = e.target.closest('.link-item');
            const targetContainer = e.target.closest('.links-grid');
            
            // Set appropriate drop effect
            if (targetLink || targetContainer) {
                e.dataTransfer.dropEffect = 'move';
            } else {
                e.dataTransfer.dropEffect = 'none';
            }
        } catch (e) {
            console.warn('处理链接拖拽经过事件时出错:', e);
        }
        
        return false;
    },
    
    handleLinkDragLeave(e) {
        try {
            // 移除拖拽悬停样式
            if (this.dragOverElement) {
                this.dragOverElement.classList.remove('drag-over');
                this.dragOverElement = null;
            }
        } catch (e) {
            console.warn('处理链接拖拽离开事件时出错:', e);
        }
    },
    
    handleLinkDrop(e) {
        try {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            // 实现简单的链接拖拽功能
            // 完整功能需要根据实际业务逻辑完善
            this.clearLinkDragStates();
        } catch (e) {
            console.warn('处理链接拖拽放置事件时出错:', e);
        }
        
        return false;
    },
    
    handleLinkDragEnd(e) {
        try {
            this.clearLinkDragStates();
        } catch (e) {
            console.warn('处理链接拖拽结束事件时出错:', e);
        }
    },
    
    // 初始化拖拽功能
    initDragAndDrop() {
        // Clean up previous event listeners first
        try {
            this.cleanupDragAndDrop();
        } catch (e) {
            console.warn('清理之前的拖拽事件监听器时出错:', e);
        }
        
        // Add drag events to each section
        const sections = document.querySelectorAll('.links-section');
        // 保存this引用，避免在回调函数中丢失
        const self = this;
        sections.forEach(section => {
            section.setAttribute('draggable', 'true');
            
            try {
                section.addEventListener('dragstart', self.handleDragStart.bind(self));
                section.addEventListener('dragover', self.handleDragOver.bind(self));
                section.addEventListener('drop', self.handleDrop.bind(self));
                section.addEventListener('dragend', self.handleDragEnd.bind(self));
            } catch (e) {
                console.warn('添加分组拖拽事件监听器时出错:', e);
            }
        });
        
        // 初始化链接拖拽功能
        try {
            this.initLinkDragDrop();
        } catch (e) {
            console.warn('初始化链接拖拽功能时出错:', e);
        }
    },
    
    // 初始化链接拖拽功能
    initLinkDragDrop() {
        // 查找所有链接元素并添加拖拽事件
        const links = document.querySelectorAll('.link-item');
        // 保存this引用，避免在回调函数中丢失
        const self = this;
        links.forEach(link => {
            link.setAttribute('draggable', 'true');
            try {
                link.addEventListener('dragstart', self.handleLinkDragStart.bind(self));
                link.addEventListener('dragover', self.handleLinkDragOver.bind(self));
                link.addEventListener('dragleave', self.handleLinkDragLeave.bind(self));
                link.addEventListener('drop', self.handleLinkDrop.bind(self));
                link.addEventListener('dragend', self.handleLinkDragEnd.bind(self));
            } catch (e) {
                // 忽略可能的绑定错误
                console.warn('添加链接拖拽事件监听器时出错:', e);
            }
        });
        
        // 为链接容器添加drop事件
        const linkContainers = document.querySelectorAll('.links-grid');
        linkContainers.forEach(container => {
            try {
                container.addEventListener('dragover', self.handleLinkDragOver.bind(self));
                container.addEventListener('drop', self.handleLinkDrop.bind(self));
            } catch (e) {
                // 忽略可能的绑定错误
                console.warn('添加链接容器拖拽事件监听器时出错:', e);
            }
        });
    },
    
    // 清理拖拽功能
    cleanupDragAndDrop() {
        // 清理分组拖拽事件
        const sections = document.querySelectorAll('.links-section');
        // 保存this引用，避免在回调函数中丢失
        const self = this;
        sections.forEach(section => {
            section.setAttribute('draggable', 'false');
            section.classList.remove('drag-over', 'dragging');
            
            // Remove all possible drag event listeners
            try {
                section.removeEventListener('dragstart', self.handleDragStart, false);
                section.removeEventListener('dragover', self.handleDragOver, false);
                section.removeEventListener('drop', self.handleDrop, false);
                section.removeEventListener('dragend', self.handleDragEnd, false);
            } catch (e) {
                console.warn('移除分组拖拽事件监听器时出错:', e);
            }
        });
        
        // 清理链接拖拽功能
        try {
            this.cleanupLinkDragDrop();
        } catch (e) {
            console.warn('清理链接拖拽功能时出错:', e);
        }
        
        // Reset state
        this.dragSrcElement = null;
        this.dragOverElement = null;
        this.isLinkDragging = false;
        this.draggedData = null;
    },
    
    // 清理链接拖拽功能
    cleanupLinkDragDrop() {
        const links = document.querySelectorAll('.link-item');
        // 保存this引用，避免在回调函数中丢失
        const self = this;
        links.forEach(link => {
            link.removeAttribute('draggable');
            try {
                link.removeEventListener('dragstart', self.handleLinkDragStart.bind(self));
                link.removeEventListener('dragover', self.handleLinkDragOver.bind(self));
                link.removeEventListener('dragleave', self.handleLinkDragLeave.bind(self));
                link.removeEventListener('drop', self.handleLinkDrop.bind(self));
                link.removeEventListener('dragend', self.handleLinkDragEnd.bind(self));
            } catch (e) {
                // 忽略可能的绑定错误
                console.warn('清理链接拖拽事件监听器时出错:', e);
            }
        });
        
        const linkContainers = document.querySelectorAll('.links-grid');
        linkContainers.forEach(container => {
            try {
                container.removeEventListener('dragover', self.handleLinkDragOver.bind(self));
                container.removeEventListener('drop', self.handleLinkDrop.bind(self));
            } catch (e) {
                // 忽略可能的绑定错误
                console.warn('清理链接容器拖拽事件监听器时出错:', e);
            }
        });
    },
    
    // Section drag start - simplified
    handleDragStart(e) {
        try {
            this.dragSrcElement = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        } catch (e) {
            console.warn('处理拖拽开始事件时出错:', e);
        }
    },
    
    // Section drag over - simplified without border detection
    handleDragOver(e) {
        try {
            if (e.preventDefault) {
                e.preventDefault();
            }
            
            // Find valid target
            const targetSection = e.target.closest('.links-section');
            
            // Set appropriate drop effect
            if (targetSection && targetSection !== this.dragSrcElement) {
                e.dataTransfer.dropEffect = 'move';
            } else {
                e.dataTransfer.dropEffect = 'none';
            }
        } catch (e) {
            console.warn('处理拖拽经过事件时出错:', e);
        }
        
        return false;
    },
    
    // Section drag drop - simplified logic
    handleDrop(e) {
        try {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            const targetSection = e.target.closest('.links-section');
            
            if (this.dragSrcElement && targetSection && this.dragSrcElement !== targetSection) {
                try {
                    // Get source and target section indexes
                    const sections = Array.from(document.querySelectorAll('.links-section'));
                    const srcIndex = sections.indexOf(this.dragSrcElement);
                    const targetIndex = sections.indexOf(targetSection);
                    
                    if (srcIndex !== -1 && targetIndex !== -1) {
                        // Rearrange data
                        const sectionsData = DataAPI.getSections();
                        const [movedSection] = sectionsData.splice(srcIndex, 1);
                        sectionsData.splice(targetIndex, 0, movedSection);
                        
                        // Save and re-render
                        DataAPI.updateSections(sectionsData);
                        Data.saveSectionsData();
                        if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                            Renderer.renderSections();
                        }
                    }
                } catch (error) {
                    console.error('Section drag drop error:', error);
                    // Fallback error handling
                    if (window.alert) {
                        alert('Section drag and drop failed, please try again');
                    }
                }
            }
        } catch (e) {
            console.warn('处理拖拽放置事件时出错:', e);
        }
        
        return false;
    },
    
    // Section drag end
    handleDragEnd(e) {
        try {
            // Properly clear all drag states
            this.clearLinkDragStates();
        } catch (e) {
            console.warn('处理拖拽结束事件时出错:', e);
        }
    },
    
    // 清除链接拖拽状态
    clearLinkDragStates() {
        try {
            // 移除所有拖拽样式
            if (this.dragSrcElement) {
                this.dragSrcElement.classList.remove('dragging');
            }
            
            if (this.dragOverElement) {
                this.dragOverElement.classList.remove('drag-over');
            }
            
            // 重置拖拽状态
            this.dragSrcElement = null;
            this.dragOverElement = null;
            this.isLinkDragging = false;
            this.draggedData = null;
        } catch (e) {
            console.warn('清除拖拽状态时出错:', e);
        }
    }
};