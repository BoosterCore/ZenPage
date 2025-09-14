// 工具函数模块
const Utils = {
    // 颜色变浅函数
    lightenColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);
        
        R = Math.min(255, Math.floor(R + (255 - R) * percent / 100));
        G = Math.min(255, Math.floor(G + (255 - G) * percent / 100));
        B = Math.min(255, Math.floor(B + (255 - B) * percent / 100));
        
        return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
    },
    
    // 为模态框生成略浅的颜色
    lightenColorForModal(color) {
        // 如果是十六进制颜色
        if (color.startsWith('#')) {
            let R = parseInt(color.substring(1, 3), 16);
            let G = parseInt(color.substring(3, 5), 16);
            let B = parseInt(color.substring(5, 7), 16);
            
            // 增加亮度20%
            R = Math.min(255, Math.floor(R + (255 - R) * 0.2));
            G = Math.min(255, Math.floor(G + (255 - G) * 0.2));
            B = Math.min(255, Math.floor(B + (255 - B) * 0.2));
            
            // 转换为RGBA格式，带透明度
            return `rgba(${R}, ${G}, ${B}, 0.5)`;
        }
        
        // 如果是RGB颜色
        if (color.startsWith('rgb(')) {
            const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                let R = parseInt(match[1]);
                let G = parseInt(match[2]);
                let B = parseInt(match[3]);
                
                // 增加亮度20%
                R = Math.min(255, Math.floor(R + (255 - R) * 0.2));
                G = Math.min(255, Math.floor(G + (255 - G) * 0.2));
                B = Math.min(255, Math.floor(B + (255 - B) * 0.2));
                
                // 转换为RGBA格式，带透明度
                return `rgba(${R}, ${G}, ${B}, 0.5)`;
            }
        }
        
        // 如果是RGBA颜色
        if (color.startsWith('rgba(')) {
            const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (match) {
                let R = parseInt(match[1]);
                let G = parseInt(match[2]);
                let B = parseInt(match[3]);
                
                // 增加亮度20%
                R = Math.min(255, Math.floor(R + (255 - R) * 0.2));
                G = Math.min(255, Math.floor(G + (255 - G) * 0.2));
                B = Math.min(255, Math.floor(B + (255 - B) * 0.2));
                
                // 保持原有透明度或使用0.5
                const alpha = parseFloat(match[4]) || 0.5;
                return `rgba(${R}, ${G}, ${B}, ${alpha})`;
            }
        }
        
        // 默认返回浅灰色
        return 'rgba(100, 100, 100, 0.5)';
    },
    
    // 获取网站favicon的函数
    getFaviconUrl(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.origin}/favicon.ico`;
        } catch (e) {
            return null;
        }
    },
    
    // 检查图片URL是否有效
    isImageValid(imgUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            // 添加时间限制，避免长时间等待
            setTimeout(() => resolve(false), 3000);
            img.src = imgUrl;
        });
    },
    
    // 加载favicon并替换默认图标
    async loadFavicon(linkItem, faviconUrl, defaultIcon) {
        const iconElement = linkItem.querySelector('.link-icon');
        
        if (faviconUrl) {
            // 先尝试加载favicon
            const isValid = await this.isImageValid(faviconUrl);
            if (isValid) {
                // 如果favicon加载成功，替换默认图标
                iconElement.innerHTML = `<img src="${faviconUrl}" alt="favicon" onerror="this.onerror=null;this.parentElement.innerHTML='${defaultIcon || '❓'}';">`;
                return;
            }
        }
        
        // 如果favicon加载失败或没有favicon，使用默认图标
        iconElement.innerHTML = defaultIcon || '❓';
    },
    
    // 生成基于颜色的渐变色（与CSS中定义的渐变保持一致）
    generateGradientFromColor(baseColor, angle = '90') {
        // 将十六进制颜色转换为RGB
        let r, g, b;
        if (baseColor.startsWith('#')) {
            r = parseInt(baseColor.substring(1, 3), 16);
            g = parseInt(baseColor.substring(3, 5), 16);
            b = parseInt(baseColor.substring(5, 7), 16);
        } else if (baseColor.startsWith('rgb')) {
            const match = baseColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
            }
        }
        
        // 计算渐变中的其他颜色值，使其与CSS中的定义保持一致风格
        // 最暗色 (对应CSS中的#1a1a1a)
        const darkestR = Math.max(0, r - 37);
        const darkestG = Math.max(0, g - 37);
        const darkestB = Math.max(0, b - 37);
        
        // 中间深色 (对应CSS中的#333333)
        const darkR = Math.max(0, r - 0);
        const darkG = Math.max(0, g - 0);
        const darkB = Math.max(0, b - 0);
        
        // 中间浅色 (对应CSS中的#4d4d4d)
        const lightR = Math.min(255, r + 27);
        const lightG = Math.min(255, g + 27);
        const lightB = Math.min(255, b + 27);
        
        // 最浅色 (对应CSS中的#666666)
        const lightestR = Math.min(255, r + 40);
        const lightestG = Math.min(255, g + 40);
        const lightestB = Math.min(255, b + 40);
        
        // 返回与CSS一致的4色渐变
        return `linear-gradient(${angle}deg, 
            rgb(${darkestR}, ${darkestG}, ${darkestB}) 0%, 
            rgb(${darkR}, ${darkG}, ${darkB}) 60%, 
            rgb(${lightR}, ${lightG}, ${lightB}) 90%, 
            rgb(${lightestR}, ${lightestG}, ${lightestB}) 100%)`;
    }
};