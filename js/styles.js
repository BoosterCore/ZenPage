// 样式管理模块
const Styles = {
    // 加载保存的标题样式
    loadTitleStyles() {
        const savedTitle = localStorage.getItem('pageTitle');
        const fontFamily = localStorage.getItem('titleFontFamily');
        const fontSize = localStorage.getItem('titleFontSize');
        const fontColor = localStorage.getItem('titleFontColor');
        const pageBgColor = localStorage.getItem('pageBgColor');
        const pageBgGradient = localStorage.getItem('pageBgGradient');
        const gradientAngle = localStorage.getItem('gradientAngle');
        
        const titleElement = document.getElementById('pageTitle');
        const titleInput = document.getElementById('pageTitleInput');
        
        // 加载页面标题
        if (savedTitle) {
            titleElement.innerText = savedTitle;
            if (titleInput) {
                titleInput.value = savedTitle;
            }
        }
        
        if (fontFamily) {
            titleElement.style.fontFamily = fontFamily;
            document.getElementById('fontFamily').value = fontFamily;
        }
        
        if (fontSize) {
            titleElement.style.fontSize = fontSize + 'px';
            document.getElementById('fontSize').value = fontSize;
            document.getElementById('fontSizeValue').textContent = fontSize + 'px';
        }
        
        if (fontColor) {
            titleElement.style.color = fontColor;
            const formattedFontColor = this.formatColorValue(fontColor);
            document.getElementById('fontColor').value = formattedFontColor;
            document.getElementById('fontColorPreview').style.backgroundColor = formattedFontColor;
            document.getElementById('fontColorValue').textContent = formattedFontColor;
        }
        
        // 加载渐变角度
        if (gradientAngle) {
            document.getElementById('gradientAngle').value = gradientAngle;
            document.getElementById('gradientAngleValue').textContent = gradientAngle + '°';
        }
        
        // 加载页面背景色和渐变
        if (pageBgGradient) {
            document.body.style.background = pageBgGradient;
        } else if (pageBgColor) {
            document.body.style.backgroundColor = pageBgColor;
            const formattedPageBgColor = this.formatColorValue(pageBgColor);
            document.getElementById('pageBgColor').value = formattedPageBgColor;
            document.getElementById('pageBgColorPreview').style.backgroundColor = formattedPageBgColor;
            document.getElementById('pageBgColorValue').textContent = formattedPageBgColor;
            
            // 如果没有保存的渐变，则根据角度生成
            if (!pageBgGradient && gradientAngle) {
                const gradient = Utils.generateGradientFromColor(pageBgColor, gradientAngle);
                document.body.style.background = gradient;
                localStorage.setItem('pageBgGradient', gradient);
            }
        }
        
        UI.updateModalBackgroundColor();
    },
    
    // 重置标题样式（排除页面标题文本）
    resetTitleStyles() {
        const titleElement = document.getElementById('pageTitle');
        
        // 重置为默认样式（不重置标题文本）
        titleElement.style.fontFamily = 'Arial, sans-serif';
        titleElement.style.fontSize = '56px';
        titleElement.style.color = '#ffffff';
        
        // 重置页面背景色为默认（使用渐变色）
        const defaultGradient = Utils.generateGradientFromColor('#333333', '90');
        document.body.style.background = defaultGradient;
        
        // 保存到localStorage
        localStorage.setItem('pageBgColor', '#333333');
        localStorage.setItem('pageBgGradient', defaultGradient);
        localStorage.setItem('gradientAngle', '90');
        
        // 重置控制面板样式
        document.getElementById('fontFamily').value = 'Arial, sans-serif';
        document.getElementById('fontSize').value = '56';
        document.getElementById('fontSizeValue').textContent = '56px';
        document.getElementById('fontColor').value = '#ffffff';
        document.getElementById('pageBgColor').value = '#333333';
        document.getElementById('gradientAngle').value = '90';
        document.getElementById('gradientAngleValue').textContent = '90°';
        
        // 重置颜色预览
        document.getElementById('fontColorPreview').style.backgroundColor = '#ffffff';
        document.getElementById('fontColorValue').textContent = '#ffffff';
        document.getElementById('pageBgColorPreview').style.backgroundColor = '#333333';
        document.getElementById('pageBgColorValue').textContent = '#333333';
        
        // 重置模态框背景色
        UI.updateModalBackgroundColor();
        
        // 清除本地存储中的样式设置（不包括pageTitle）
        localStorage.removeItem('titleFontFamily');
        localStorage.removeItem('titleFontSize');
        localStorage.removeItem('titleFontColor');
    },
    
    // 更新特定分组的链接按钮样式并保存
    updateSectionLinkButtonStyle(sectionId, color) {
        let style = document.getElementById(`linkButtonStyle-${sectionId}`);
        if (!style) {
            style = document.createElement('style');
            style.id = `linkButtonStyle-${sectionId}`;
            document.head.appendChild(style);
        }

        // 确保颜色值包含透明度
        let colorWithAlpha = color;
        if (color.startsWith('#')) {
            // 如果是十六进制颜色，转换为带透明度的 rgba
            const R = parseInt(color.substring(1, 3), 16);
            const G = parseInt(color.substring(3, 5), 16);
            const B = parseInt(color.substring(5, 7), 16);
            colorWithAlpha = `rgba(${R}, ${G}, ${B}, 0.85)`;
        } else if (color.startsWith('rgb(') && !color.includes('rgba')) {
            // 如果是 rgb 格式，添加透明度
            const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                colorWithAlpha = `rgba(${match[1]}, ${match[2]}, ${match[3]}, 0.85)`;
            }
        }

        style.textContent = `
            #linksContainer-${sectionId} .link-button {
                background-color: ${color} !important;
            }
        `;
        
        // 同时更新添加链接按钮的背景色
        const addLinkPlaceholders = document.querySelectorAll(`#linksContainer-${sectionId} .add-link-placeholder`);
        addLinkPlaceholders.forEach(placeholder => {
            placeholder.style.backgroundColor = color;
        });
    },
    
    // 辅助函数：格式化颜色值为十六进制格式
    formatColorValue(color) {
        // 如果已经是十六进制格式，直接返回
        if (typeof color === 'string' && color.startsWith('#')) {
            return color;
        }
        
        // 如果是 rgb 格式，转换为十六进制
        if (typeof color === 'string' && color.startsWith('rgb')) {
            const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const r = parseInt(match[1]).toString(16).padStart(2, '0');
                const g = parseInt(match[2]).toString(16).padStart(2, '0');
                const b = parseInt(match[3]).toString(16).padStart(2, '0');
                return `#${r}${g}${b}`;
            }
        }
        
        // 如果是 rgba 格式，忽略透明度并转换为十六进制
        if (typeof color === 'string' && color.startsWith('rgba')) {
            const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const r = parseInt(match[1]).toString(16).padStart(2, '0');
                const g = parseInt(match[2]).toString(16).padStart(2, '0');
                const b = parseInt(match[3]).toString(16).padStart(2, '0');
                return `#${r}${g}${b}`;
            }
        }
        
        // 如果无法识别格式，返回默认值
        return color || '#ffffff';
    }
};