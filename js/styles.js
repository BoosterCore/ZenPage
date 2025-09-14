// 样式管理模块
const Styles = {
    // 重置标题样式
    resetTitleStyles() {
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.style.fontFamily = 'Arial, sans-serif';
            pageTitle.style.fontSize = '56px';
            pageTitle.style.color = '#ffffff';
        }
        
        // 重置背景色
        const defaultGradient = 'linear-gradient(180deg, #1a1a1a 0%, #333333 60%, #4d4d4d 90%, #666666 100%)';
        document.body.style.background = defaultGradient;
        
        // 保存到localStorage
        localStorage.removeItem('titleFontFamily');
        localStorage.removeItem('titleFontSize');
        localStorage.removeItem('titleFontColor');
        localStorage.removeItem('pageBgColor');
        localStorage.removeItem('pageBgGradient');
        localStorage.removeItem('gradientAngle');
        
        // 更新UI控件
        const fontFamily = document.getElementById('fontFamily');
        const fontSize = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const fontColor = document.getElementById('fontColor');
        const fontColorPreview = document.getElementById('fontColorPreview');
        const fontColorValue = document.getElementById('fontColorValue');
        const pageBgColor = document.getElementById('pageBgColor');
        const pageBgColorPreview = document.getElementById('pageBgColorPreview');
        const pageBgColorValue = document.getElementById('pageBgColorValue');
        const gradientAngle = document.getElementById('gradientAngle');
        const gradientAngleValue = document.getElementById('gradientAngleValue');
        
        if (fontFamily) fontFamily.value = 'Arial, sans-serif';
        if (fontSize) fontSize.value = '56';
        if (fontSizeValue) fontSizeValue.textContent = '56px';
        if (fontColor) fontColor.value = '#ffffff';
        if (fontColorPreview) fontColorPreview.style.backgroundColor = '#ffffff';
        if (fontColorValue) fontColorValue.textContent = '#ffffff';
        if (pageBgColor) pageBgColor.value = '#333333';
        if (pageBgColorPreview) pageBgColorPreview.style.backgroundColor = '#333333';
        if (pageBgColorValue) pageBgColorValue.textContent = '#333333';
        if (gradientAngle) gradientAngle.value = '90';
        if (gradientAngleValue) gradientAngleValue.textContent = '90°';
        
        // 更新模态框背景色
        if (typeof UI !== 'undefined' && typeof UI.updateModalBackgroundColor === 'function') {
            UI.updateModalBackgroundColor();
        }
    },
    
    // 更新分组链接按钮样式
    updateSectionLinkButtonStyle(sectionId, buttonColor) {
        const linksContainer = document.getElementById(`linksContainer-${sectionId}`);
        if (!linksContainer) return;
        
        // 更新该分组内所有链接按钮的样式
        const linkButtons = linksContainer.querySelectorAll('.link-button');
        linkButtons.forEach(button => {
            // 使用带透明度的颜色
            const colorWithAlpha = Utils.convertToRGBA(buttonColor, 0.25);
            button.style.backgroundColor = colorWithAlpha;
        });
        
        // 更新添加链接按钮的样式
        const addLinkPlaceholder = linksContainer.querySelector('.add-link-placeholder');
        if (addLinkPlaceholder) {
            const colorWithAlpha = Utils.convertToRGBA(buttonColor, 0.25);
            addLinkPlaceholder.style.backgroundColor = colorWithAlpha;
        }
    },
    
    // 实时更新分组背景和按钮颜色
    updateSectionColorsRealTime(sectionId, backgroundColor) {
        // 更新分组背景色
        const sectionElement = document.querySelector(`.links-section[data-section-id="${sectionId}"]`);
        if (sectionElement) {
            sectionElement.style.backgroundColor = Utils.convertToRGBA(backgroundColor, 0.25);
        }
        
        // 计算并应用按钮颜色
        const buttonColor = Utils.lightenColor(backgroundColor, 20);
        this.updateSectionLinkButtonStyle(sectionId, buttonColor);
        
        // 保存到全局数据
        const sectionIndex = window.sectionsData.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
            window.sectionsData[sectionIndex].backgroundColor = backgroundColor;
            window.sectionsData[sectionIndex].linkButtonColor = buttonColor;
        }
    },
    
    // 格式化颜色值显示
    formatColorValue(color) {
        if (!color) return '#444444';
        
        // 如果是rgb格式，转换为hex
        if (color.startsWith('rgb')) {
            const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const r = parseInt(match[1]).toString(16).padStart(2, '0');
                const g = parseInt(match[2]).toString(16).padStart(2, '0');
                const b = parseInt(match[3]).toString(16).padStart(2, '0');
                return `#${r}${g}${b}`;
            }
        }
        
        return color;
    }
};