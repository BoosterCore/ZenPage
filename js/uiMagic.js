// UI幻化功能模块
const UIMagic = {
    // 从图片中提取主要颜色
    extractColorsFromImage(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            
            img.onload = function() {
                try {
                    // 创建canvas来分析图片
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 设置canvas尺寸
                    const maxWidth = 200;
                    const maxHeight = 200;
                    let width = img.width;
                    let height = img.height;
                    
                    // 保持宽高比并缩小图片以提高性能
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 绘制缩小后的图片
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 获取图片数据
                    const imageData = ctx.getImageData(0, 0, width, height);
                    const data = imageData.data;
                    
                    // 颜色统计
                    const colorCounts = {};
                    
                    // 分析所有像素（每隔10个像素采样以提高性能）
                    for (let i = 0; i < data.length; i += 40) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];
                        
                        // 忽略透明度太低的像素
                        if (a < 128) continue;
                        
                        // 检查是否为接近黑白的颜色，如果是则跳过
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        const diff = max - min;
                        
                        // 如果颜色饱和度太低（接近灰色），则跳过
                        if (diff < 20) continue;
                        
                        // 创建颜色键值（使用RGB原值，不进行分组）
                        const key = `${r},${g},${b}`;
                        
                        if (!colorCounts[key]) {
                            colorCounts[key] = 0;
                        }
                        colorCounts[key]++;
                    }
                    
                    // 转换为颜色数组并按出现频率排序
                    let colors = Object.keys(colorCounts)
                        .map(key => {
                            const [r, g, b] = key.split(',').map(Number);
                            return {
                                r, g, b,
                                count: colorCounts[key],
                                hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
                            };
                        })
                        .sort((a, b) => b.count - a.count);
                    
                    // 如果颜色太少，降低饱和度阈值重新采样
                    if (colors.length < 6) {
                        const colorCounts2 = {};
                        for (let i = 0; i < data.length; i += 20) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            const a = data[i + 3];
                            
                            // 忽略透明度太低的像素
                            if (a < 128) continue;
                            
                            // 降低饱和度要求
                            const max = Math.max(r, g, b);
                            const min = Math.min(r, g, b);
                            const diff = max - min;
                            
                            if (diff < 10) continue;
                            
                            // 使用RGB原值
                            const key = `${r},${g},${b}`;
                            
                            if (!colorCounts2[key]) {
                                colorCounts2[key] = 0;
                            }
                            colorCounts2[key]++;
                        }
                        
                        colors = Object.keys(colorCounts2)
                            .map(key => {
                                const [r, g, b] = key.split(',').map(Number);
                                return {
                                    r, g, b,
                                    count: colorCounts2[key],
                                    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
                                };
                            })
                            .sort((a, b) => b.count - a.count);
                    }
                    
                    // 如果颜色还是太少，返回所有找到的颜色
                    if (colors.length < 6) {
                        resolve(colors);
                        return;
                    }
                    
                    // 过滤掉过于接近的颜色，保留最具代表性的颜色
                    const filteredColors = UIMagic.filterSimilarColors(colors, 10);
                    
                    // 确保有足够的颜色
                    while (filteredColors.length < 6 && colors.length > filteredColors.length) {
                        const nextColor = colors.find(c => !filteredColors.some(fc => fc.hex === c.hex));
                        if (nextColor) {
                            filteredColors.push(nextColor);
                        } else {
                            break;
                        }
                    }
                    
                    resolve(filteredColors.slice(0, 10)); // 最多返回10个颜色
                } catch (error) {
                    console.error('颜色提取错误:', error);
                    // 返回默认颜色
                    resolve([
                        { hex: '#444444', r: 68, g: 68, b: 68 },
                        { hex: '#555555', r: 85, g: 85, b: 85 },
                        { hex: '#666666', r: 102, g: 102, b: 102 },
                        { hex: '#777777', r: 119, g: 119, b: 119 },
                        { hex: '#888888', r: 136, g: 136, b: 136 },
                        { hex: '#999999', r: 153, g: 153, b: 153 }
                    ]);
                }
            };
            
            img.onerror = function() {
                // 如果图片加载失败，返回默认颜色
                resolve([
                    { hex: '#444444', r: 68, g: 68, b: 68 },
                    { hex: '#555555', r: 85, g: 85, b: 85 },
                    { hex: '#666666', r: 102, g: 102, b: 102 },
                    { hex: '#777777', r: 119, g: 119, b: 119 },
                    { hex: '#888888', r: 136, g: 136, b: 136 },
                    { hex: '#999999', r: 153, g: 153, b: 153 }
                ]);
            };
            
            img.src = imageUrl;
        });
    },
    
    // 过滤相似颜色
    filterSimilarColors(colors, maxColors) {
        if (colors.length === 0) return [];
        
        const result = [colors[0]]; // 总是包含最常见的颜色
        
        for (let i = 1; i < colors.length && result.length < maxColors; i++) {
            const currentColor = colors[i];
            let isSimilar = false;
            
            // 检查是否与已选颜色过于相似
            for (const selectedColor of result) {
                const diff = Math.abs(currentColor.r - selectedColor.r) +
                            Math.abs(currentColor.g - selectedColor.g) +
                            Math.abs(currentColor.b - selectedColor.b);
                
                // 如果颜色差异小于阈值，则认为是相似颜色
                if (diff < 30) { // 降低相似性阈值
                    isSimilar = true;
                    break;
                }
            }
            
            // 如果不相似，则添加
            if (!isSimilar) {
                result.push(currentColor);
            }
        }
        
        return result;
    },
    
    // 生成配色方案
    generateColorScheme(dominantColors) {
        // 确保至少有6个颜色
        while (dominantColors.length < 6) {
            // 如果颜色不足，生成一些补充颜色
            const lastColor = dominantColors[dominantColors.length - 1];
            const newColor = {
                r: Math.min(255, Math.max(0, lastColor.r + (Math.random() > 0.5 ? 30 : -30))),
                g: Math.min(255, Math.max(0, lastColor.g + (Math.random() > 0.5 ? 30 : -30))),
                b: Math.min(255, Math.max(0, lastColor.b + (Math.random() > 0.5 ? 30 : -30)))
            };
            newColor.hex = `#${newColor.r.toString(16).padStart(2, '0')}${newColor.g.toString(16).padStart(2, '0')}${newColor.b.toString(16).padStart(2, '0')}`;
            dominantColors.push(newColor);
        }
        
        // 按亮度排序
        dominantColors.sort((a, b) => {
            const brightnessA = (a.r * 299 + a.g * 587 + a.b * 114) / 1000;
            const brightnessB = (b.r * 299 + b.g * 587 + b.b * 114) / 1000;
            return brightnessA - brightnessB;
        });
        
        return {
            // 主背景色（最暗的颜色）
            mainBg: dominantColors[0].hex,
            // 辅助背景色
            secondaryBg: dominantColors[1].hex,
            // 分组背景色
            sectionBg: dominantColors[2].hex,
            // 链接按钮背景色
            linkButtonBg: dominantColors[3].hex,
            // 强调色1
            accent1: dominantColors[4].hex,
            // 强调色2
            accent2: dominantColors[5].hex
        };
    },
    
    // 应用配色方案
    applyColorScheme(colorScheme) {
        // 更新页面背景渐变
        const gradient = Utils.generateGradientFromColor(colorScheme.mainBg, '180');
        document.body.style.background = gradient;
        localStorage.setItem('pageBgGradient', gradient);
        localStorage.setItem('pageBgColor', colorScheme.mainBg);
        
        // 更新标题颜色
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.style.color = colorScheme.accent2;
            localStorage.setItem('titleFontColor', colorScheme.accent2);
        }
        
        // 更新分组背景色（如果存在分组）
        if (typeof window.sectionsData !== 'undefined' && window.sectionsData.length > 0) {
            window.sectionsData.forEach((section, index) => {
                // 循环使用颜色方案中的颜色
                const colorIndex = index % 3; // 使用前3个颜色
                const colors = [colorScheme.sectionBg, colorScheme.accent1, colorScheme.linkButtonBg];
                section.backgroundColor = colors[colorIndex];
                section.linkButtonColor = Utils.lightenColor(colors[colorIndex], 20);
            });
            
            localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
            
            // 重新渲染分组
            if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                Renderer.renderSections();
            }
        }
        
        // 更新模态框背景色
        if (typeof UI !== 'undefined' && typeof UI.updateModalBackgroundColor === 'function') {
            UI.updateModalBackgroundColor();
        }
    }
};