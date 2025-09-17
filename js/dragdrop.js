// dragdrop.js - 拖拽管理模块
const DragDrop = {
    // State management
    dragSrcElement: null,
    dragOverElement: null,
    isLinkDragging: false,
    draggedData: null,
    
    // Initialize drag and drop functionality
    initDragAndDrop() {
        // Clean up previous event listeners first
        this.cleanupDragAndDrop();
        
        // Add drag events to each section
        document.querySelectorAll('.links-section').forEach(section => {
            section.setAttribute('draggable', 'true');
            
            section.addEventListener('dragstart', this.handleDragStart.bind(this));
            section.addEventListener('dragover', this.handleDragOver.bind(this));
            section.addEventListener('drop', this.handleDrop.bind(this));
            section.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
        
        // If in edit mode, initialize link drag and drop
        if (DataAPI && DataAPI.isEditMode()) {
            // 不再初始化链接拖拽功能
            // this.initLinkDragDrop();
        }
    },
    
    // Initialize link drag and drop functionality - 已移除功能
    initLinkDragDrop() {
        // 移除链接拖拽功能 - 不再需要此函数
        return;
    },
    
    // Clean up drag and drop functionality
    cleanupDragAndDrop() {
        // Clean up section dragging
        document.querySelectorAll('.links-section').forEach(section => {
            section.setAttribute('draggable', 'false');
            section.classList.remove('drag-over', 'dragging');
            
            // Remove all possible drag event listeners
            section.removeEventListener('dragstart', this.handleDragStart, false);
            section.removeEventListener('dragover', this.handleDragOver, false);
            section.removeEventListener('drop', this.handleDrop, false);
            section.removeEventListener('dragend', this.handleDragEnd, false);
        });
        
        // Reset state
        this.dragSrcElement = null;
        this.dragOverElement = null;
        this.isLinkDragging = false;
        this.draggedData = null;
    },
    
    // Section drag start - simplified
    handleDragStart(e) {
        this.dragSrcElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    },
    
    // Section drag over - simplified without border detection
    handleDragOver(e) {
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
        
        return false;
    },
    
    // Section drag drop - simplified logic
    handleDrop(e) {
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
        
        return false;
    },
    
    // Section drag end
    handleDragEnd(e) {
        // Properly clear all drag states
        this.clearLinkDragStates();
    },
    
    // Clear link drag states
    clearLinkDragStates() {
        // Remove all drag styles
        if (this.dragSrcElement) {
            this.dragSrcElement.classList.remove('dragging');
        }
        
        if (this.dragOverElement) {
            this.dragOverElement.classList.remove('drag-over');
        }
        
        // Reset state
        this.dragSrcElement = null;
        this.dragOverElement = null;
        this.isLinkDragging = false;
        this.draggedData = null;
    }
};