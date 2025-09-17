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
    
    // 重置UI配色（只重置配色，不重置其他样式）
    resetUIColors() {
        // 重置页面背景色
        const defaultGradient = 'linear-gradient(180deg, #1a1a1a 0%, #333333 60%, #4d4d4d 90%, #666666 100%)';
        document.body.style.background = defaultGradient;
        
        // 重置标题颜色
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.style.color = '#ffffff';
        }
        
        // 重置分组背景色
        const sectionsData = DataAPI.getSections();
        if (sectionsData.length > 0) {
            sectionsData.forEach((section, index) => {
                // 默认颜色方案
                const defaultColors = ['#444444', '#555555', '#666666'];
                section.backgroundColor = defaultColors[index % defaultColors.length];
                section.linkButtonColor = Utils.lightenColor(section.backgroundColor, 20);
            });
            
            DataAPI.updateSections(sectionsData);
            Data.saveSectionsData();
            
            // 重新渲染分组
            if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                Renderer.renderSections();
            }
        }
        
        // 保存到localStorage
        localStorage.setItem('pageBgGradient', defaultGradient);
        localStorage.setItem('pageBgColor', '#333333');
        localStorage.setItem('titleFontColor', '#ffffff');
        localStorage.removeItem('gradientAngle'); // 使用默认角度90度
        
        // 更新UI控件
        const fontColor = document.getElementById('fontColor');
        const fontColorPreview = document.getElementById('fontColorPreview');
        const fontColorValue = document.getElementById('fontColorValue');
        const pageBgColor = document.getElementById('pageBgColor');
        const pageBgColorPreview = document.getElementById('pageBgColorPreview');
        const pageBgColorValue = document.getElementById('pageBgColorValue');
        const gradientAngle = document.getElementById('gradientAngle');
        const gradientAngleValue = document.getElementById('gradientAngleValue');
        
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
            // 同步更新原始背景色，确保悬停效果与新颜色匹配
            button._originalBg = colorWithAlpha;
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
        const sectionsData = DataAPI.getSections();
        const sectionIndex = sectionsData.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
            sectionsData[sectionIndex].backgroundColor = backgroundColor;
            sectionsData[sectionIndex].linkButtonColor = buttonColor;
            DataAPI.updateSections(sectionsData);
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
    },
    
    // 更新链接按钮悬停效果
    updateLinkButtonHoverEffect(sectionId) {
        const linksContainer = document.getElementById(`linksContainer-${sectionId}`);
        if (!linksContainer) return;
        
        // 获取该分组的所有链接按钮
        const linkButtons = linksContainer.querySelectorAll('.link-button');
        linkButtons.forEach(button => {
            // 为每个按钮存储原始背景色，只在不存在时设置，确保原始背景色不会被覆盖
            if (!button._originalBg) {
                button._originalBg = button.style.backgroundColor;
            }
            
            // 移除可能存在的旧事件监听器，避免重复绑定
            // 先存储事件处理函数引用，以便后续可以移除
            if (!button._hoverHandlers) {
                button._hoverHandlers = {
                    mouseenter: function() {
                        // 确保始终使用最初存储的原始背景色，而不是当前可能已被修改的颜色
                        const originalBg = this._originalBg;
                        
                        // 如果是 rgba 格式，提取 RGB 值并生成更亮的颜色
                        if (originalBg && originalBg.startsWith('rgba')) {
                            const match = originalBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                            if (match) {
                                const r = parseInt(match[1]);
                                const g = parseInt(match[2]);
                                const b = parseInt(match[3]);
                                
                                // 生成更亮的颜色（增加亮度30%）
                                const lighterR = Math.min(255, r + Math.round((255 - r) * 0.3));
                                const lighterG = Math.min(255, g + Math.round((255 - g) * 0.3));
                                const lighterB = Math.min(255, b + Math.round((255 - b) * 0.3));
                                
                                // 应用更亮的背景色和悬停效果
                                this.style.backgroundColor = `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
                                this.style.transform = 'translateY(-5px)';
                                this.style.boxShadow = '0 7px 15px rgba(0, 0, 0, 0.3)';
                            }
                        }
                    },
                    mouseleave: function() {
                        // 恢复原始样式
                        this.style.backgroundColor = this._originalBg || '';
                        this.style.transform = '';
                        this.style.boxShadow = '';
                    }
                };
            }
            
            // 移除旧事件监听器
            button.removeEventListener('mouseenter', button._hoverHandlers.mouseenter);
            button.removeEventListener('mouseleave', button._hoverHandlers.mouseleave);
            
            // 添加新事件监听器
            button.addEventListener('mouseenter', button._hoverHandlers.mouseenter);
            button.addEventListener('mouseleave', button._hoverHandlers.mouseleave);
        });
    }
};