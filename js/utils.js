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
        let r, g, b;
        
        // 解析十六进制颜色
        if (baseColor.startsWith('#')) {
            // 处理3位十六进制颜色
            if (baseColor.length === 4) {
                r = parseInt(baseColor[1] + baseColor[1], 16);
                g = parseInt(baseColor[2] + baseColor[2], 16);
                b = parseInt(baseColor[3] + baseColor[3], 16);
            } else {
                r = parseInt(baseColor.substring(1, 3), 16);
                g = parseInt(baseColor.substring(3, 5), 16);
                b = parseInt(baseColor.substring(5, 7), 16);
            }
        } else if (baseColor.startsWith('rgb')) {
            const match = baseColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
            }
        }
        
        if (r === undefined || g === undefined || b === undefined) {
            // 默认颜色
            r = 51; g = 51; b = 51; // #333333
        }
        
        // 计算渐变中的其他颜色值
        // 最暗色 (比基础色暗37)
        const darkestR = Math.max(0, r - 37);
        const darkestG = Math.max(0, g - 37);
        const darkestB = Math.max(0, b - 37);
        
        // 中间深色 (基础色)
        const darkR = r;
        const darkG = g;
        const darkB = b;
        
        // 中间浅色 (比基础色亮27)
        const lightR = Math.min(255, r + 27);
        const lightG = Math.min(255, g + 27);
        const lightB = Math.min(255, b + 27);
        
        // 最浅色 (比基础色亮40)
        const lightestR = Math.min(255, r + 40);
        const lightestG = Math.min(255, g + 40);
        const lightestB = Math.min(255, b + 40);
        
        // 返回4色渐变
        return `linear-gradient(${angle}deg, 
            rgb(${darkestR}, ${darkestG}, ${darkestB}) 0%, 
            rgb(${darkR}, ${darkG}, ${darkB}) 60%, 
            rgb(${lightR}, ${lightG}, ${lightB}) 90%, 
            rgb(${lightestR}, ${lightestG}, ${lightestB}) 100%)`;
    }
};

// 颜色处理工具函数
Utils.convertToRGBA = function(hex, alpha) {
    // 移除#前缀
    hex = hex.replace('#', '');
    
    // 解析十六进制颜色值
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

Utils.lightenColor = function(color, percent) {
    // 移除#前缀
    color = color.replace('#', '');
    
    // 解析十六进制颜色值
    if (color.length === 3) {
        color = color.split('').map(char => char + char).join('');
    }
    
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // 增加亮度
    r = Math.min(255, r + Math.round((255 - r) * (percent / 100)));
    g = Math.min(255, g + Math.round((255 - g) * (percent / 100)));
    b = Math.min(255, b + Math.round((255 - b) * (percent / 100)));
    
    // 转换回十六进制
    const rr = r.toString(16).padStart(2, '0');
    const gg = g.toString(16).padStart(2, '0');
    const bb = b.toString(16).padStart(2, '0');
    
    return `#${rr}${gg}${bb}`;
};