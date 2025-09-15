// dataAPI.js - 数据访问接口
const DataAPI = {
    // 获取分组数据
    getSections() {
        return stateManager.getState().sectionsData || [];
    },
    
    // 更新分组数据
    updateSections(sections) {
        stateManager.updateState({ sectionsData: sections });
    },
    
    // 添加分组
    addSection(section) {
        const currentState = stateManager.getState();
        const updatedSections = [...currentState.sectionsData, section];
        stateManager.updateState({ sectionsData: updatedSections });
    },
    
    // 删除分组
    deleteSection(sectionId) {
        const currentState = stateManager.getState();
        const updatedSections = currentState.sectionsData.filter(s => s.id !== sectionId);
        stateManager.updateState({ sectionsData: updatedSections });
    },
    
    // 更新分组
    updateSection(sectionId, updates) {
        const currentState = stateManager.getState();
        const updatedSections = currentState.sectionsData.map(section => {
            if (section.id === sectionId) {
                return { ...section, ...updates };
            }
            return section;
        });
        stateManager.updateState({ sectionsData: updatedSections });
    },
    
    // 获取编辑模式状态
    isEditMode() {
        return stateManager.getState().isEditMode;
    },
    
    // 设置编辑模式状态
    setEditMode(isEditMode) {
        stateManager.updateState({ isEditMode });
    },
    
    // 获取页面标题
    getPageTitle() {
        return stateManager.getState().currentPageSettings.title;
    },
    
    // 设置页面标题
    setPageTitle(title) {
        const currentState = stateManager.getState();
        stateManager.updateState({
            currentPageSettings: {
                ...currentState.currentPageSettings,
                title
            }
        });
    }
};