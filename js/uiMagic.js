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
                    
                    // 颜色统计 - 包含面积计数
                    const colorCounts = {};
                    let totalPixels = 0;
                    
                    // 分析所有像素（每隔10个像素采样以提高性能）
                    for (let i = 0; i < data.length; i += 40) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];
                        
                        // 忽略透明度太低的像素
                        if (a < 128) continue;
                        totalPixels++;
                        
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
                            const count = colorCounts[key];
                            const percentage = (count / totalPixels) * 100; // 计算占比百分比
                            return {
                                r, g, b,
                                count: count,
                                percentage: percentage,
                                hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
                                brightness: (r * 299 + g * 587 + b * 114) / 1000 // 计算亮度
                            };
                        })
                        .sort((a, b) => b.count - a.count); // 按面积占比排序
                    
                    // 如果颜色太少，降低饱和度阈值重新采样
                    if (colors.length < 6) {
                        const colorCounts2 = {};
                        totalPixels = 0;
                        for (let i = 0; i < data.length; i += 20) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            const a = data[i + 3];
                            
                            // 忽略透明度太低的像素
                            if (a < 128) continue;
                            totalPixels++;
                            
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
                                const count = colorCounts2[key];
                                const percentage = (count / totalPixels) * 100;
                                return {
                                    r, g, b,
                                    count: count,
                                    percentage: percentage,
                                    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
                                    brightness: (r * 299 + g * 587 + b * 114) / 1000
                                };
                            })
                            .sort((a, b) => b.count - a.count);
                    }
                    
                    // 如果颜色还是太少，返回所有找到的颜色
                    if (colors.length < 6) {
                        resolve(colors);
                        return;
                    }
                    
                    // 过滤掉过于接近的颜色，保留最具代表性的颜色，同时保持面积占比信息
                    const filteredColors = UIMagic.filterSimilarColorsWithPercentages(colors, 10);
                    
                    // 确保有足够的颜色
                    while (filteredColors.length < 6 && colors.length > filteredColors.length) {
                        const nextColor = colors.find(c => !filteredColors.some(fc => fc.hex === c.hex));
                        if (nextColor) {
                            filteredColors.push(nextColor);
                        } else {
                            break;
                        }
                    }
                    
                    // 按面积占比排序后返回
                    const sortedColors = filteredColors
                        .slice(0, 10)
                        .sort((a, b) => b.count - a.count);
                    
                    resolve(sortedColors);
                } catch (error) {
                    console.error('颜色提取错误:', error);
                    // 返回默认颜色
                    resolve([
                        { hex: '#444444', r: 68, g: 68, b: 68, count: 100, percentage: 20 },
                        { hex: '#555555', r: 85, g: 85, b: 85, count: 90, percentage: 18 },
                        { hex: '#666666', r: 102, g: 102, b: 102, count: 80, percentage: 16 },
                        { hex: '#777777', r: 119, g: 119, b: 119, count: 70, percentage: 14 },
                        { hex: '#888888', r: 136, g: 136, b: 136, count: 60, percentage: 12 },
                        { hex: '#999999', r: 153, g: 153, b: 153, count: 50, percentage: 10 }
                    ]);
                }
            };
            
            img.onerror = function() {
                // 如果图片加载失败，返回默认颜色
                resolve([
                    { hex: '#444444', r: 68, g: 68, b: 68, count: 100, percentage: 20 },
                    { hex: '#555555', r: 85, g: 85, b: 85, count: 90, percentage: 18 },
                    { hex: '#666666', r: 102, g: 102, b: 102, count: 80, percentage: 16 },
                    { hex: '#777777', r: 119, g: 119, b: 119, count: 70, percentage: 14 },
                    { hex: '#888888', r: 136, g: 136, b: 136, count: 60, percentage: 12 },
                    { hex: '#999999', r: 153, g: 153, b: 153, count: 50, percentage: 10 }
                ]);
            };
            
            img.src = imageUrl;
        });
    },
    
    // 过滤相似颜色，同时保持面积占比信息
    filterSimilarColorsWithPercentages(colors, maxColors) {
        if (colors.length === 0) return [];
        
        // 按面积占比排序
        colors.sort((a, b) => b.count - a.count);
        
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
        
        // 保持按面积占比排序
        return result.sort((a, b) => b.count - a.count);
    },
    
    // 生成配色方案 - 按面积占比分配颜色
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
            newColor.count = lastColor.count * 0.8; // 新颜色的面积占比略低
            newColor.percentage = lastColor.percentage * 0.8;
            dominantColors.push(newColor);
        }
        
        // 按面积占比排序（已在此前步骤完成）
        
        return {
            // 主背景色（面积占比最高的颜色）
            mainBg: dominantColors[0].hex,
            // 辅助背景色（面积占比第二的颜色）
            secondaryBg: dominantColors[1].hex,
            // 分组背景色（面积占比第三的颜色）
            sectionBg: dominantColors[2].hex,
            // 链接按钮背景色（面积占比第四的颜色）
            linkButtonBg: dominantColors[3].hex,
            // 强调色1（面积占比第五的颜色）
            accent1: dominantColors[4].hex,
            // 强调色2（面积占比第六的颜色）
            accent2: dominantColors[5].hex
        };
    },
    
    // 应用配色方案 - 按UI元素面积占比匹配颜色，并加入随机性
    applyColorScheme(colorScheme) {
        // 更新页面背景渐变（使用主背景色）
        const gradient = Utils.generateGradientFromColor(colorScheme.mainBg, '180');
        document.body.style.background = gradient;
        localStorage.setItem('pageBgGradient', gradient);
        localStorage.setItem('pageBgColor', colorScheme.mainBg);

        // 更新标题颜色（使用强调色之一）
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            // 优先使用强调色作为标题颜色，但加入随机性
            const accentColors = [colorScheme.accent1, colorScheme.accent2];
            const randomAccent = accentColors[Math.floor(Math.random() * accentColors.length)];
            pageTitle.style.color = randomAccent;
            localStorage.setItem('titleFontColor', randomAccent);
        }

        // 更新分组背景色（如果存在分组）
        const sectionsData = DataAPI.getSections();
        if (sectionsData.length > 0) {
            // 按照UI元素在页面中的面积占比分配颜色，并加入随机性
            // 页面背景 > 分组背景 > 链接按钮 > 强调色
            sectionsData.forEach((section, index) => {
                // 循环使用颜色方案中的颜色
                let backgroundColor, linkButtonColor;
                
                // 创建一个基于面积占比排序的颜色数组，但加入轻微的随机性
                const colorOptions = [
                    colorScheme.sectionBg,     // 面积占比第三的颜色
                    colorScheme.secondaryBg,   // 面积占比第二的颜色
                    colorScheme.accent1,       // 面积占比第五的颜色
                    colorScheme.accent2        // 面积占比第六的颜色
                ];
                
                // 轻微打乱颜色顺序以增加多样性，但保持优先级框架
                if (Math.random() > 0.7) { // 30% 概率轻微打乱顺序
                    // 交换相邻元素
                    const swapIndex = Math.floor(Math.random() * (colorOptions.length - 1));
                    [colorOptions[swapIndex], colorOptions[swapIndex + 1]] = 
                    [colorOptions[swapIndex + 1], colorOptions[swapIndex]];
                }
                
                // 根据分组索引选择颜色，但优先使用排序靠前的颜色
                const priorityFactor = Math.min(1, 0.7 + Math.random() * 0.3); // 0.7-1.0 之间的随机数
                const colorIndex = Math.floor(index * priorityFactor) % colorOptions.length;
                
                backgroundColor = colorOptions[colorIndex];
                linkButtonColor = Utils.lightenColor(backgroundColor, 20);
                
                section.backgroundColor = backgroundColor;
                section.linkButtonColor = linkButtonColor;
            });

            DataAPI.updateSections(sectionsData);
            Data.saveSectionsData();

            // 重新渲染分组
            if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                Renderer.renderSections();
            }
        }

        // 更新模态框背景色
        if (typeof UI !== 'undefined' && typeof UI.updateModalBackgroundColor === 'function') {
            UI.updateModalBackgroundColor();
        }

        // 同步更新页面设置面板中的颜色选择器
        if (typeof UI !== 'undefined' && typeof UI.syncColorPickers === 'function') {
            UI.syncColorPickers(colorScheme.mainBg, colorScheme.accent2);
        }
    }
};