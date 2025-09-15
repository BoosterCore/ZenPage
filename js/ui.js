// UI交互模块
const UI = {
    // 创建模态框背景遮罩
    createModalBackdrop() {
        const backdrop = document.getElementById('modalBackdrop');
        if (backdrop) {
            backdrop.style.display = 'none';
        }
    },
    
    // 显示页面模糊效果
    showBodyBlur() {
        document.body.classList.add('body-blur');
        const backdrop = document.getElementById('modalBackdrop');
        if (backdrop) backdrop.style.display = 'block';
    },
    
    // 隐藏页面模糊效果
    hideBodyBlur() {
        document.body.classList.remove('body-blur');
        const backdrop = document.getElementById('modalBackdrop');
        if (backdrop) backdrop.style.display = 'none';
    },
    
    // 根据页面背景色设置模态框背景色
    updateModalBackgroundColor() {
        // 获取计算后的body背景样式
        const computedStyle = window.getComputedStyle(document.body);
        let bodyBg = computedStyle.background || computedStyle.backgroundColor;
        
        // 如果没有获取到背景，则尝试从localStorage获取
        if (!bodyBg || bodyBg === 'none') {
            const savedBg = localStorage.getItem('pageBgGradient') || localStorage.getItem('pageBgColor');
            if (savedBg) {
                bodyBg = savedBg;
            }
        }
        
        // 从背景中提取主色调
        let baseColor = '#333333'; // 默认颜色
        
        if (bodyBg) {
            // 如果是渐变背景，提取主色调
            if (bodyBg.includes('gradient')) {
                // 尝试提取渐变中的颜色值
                const colorMatches = bodyBg.match(/#([0-9a-fA-F]{3,6})/g);
                if (colorMatches && colorMatches.length > 0) {
                    // 使用中间颜色作为基准
                    baseColor = colorMatches[Math.floor(colorMatches.length / 2)] || '#333333';
                } else if (bodyBg.includes('rgb')) {
                    // 处理rgb格式的渐变
                    const rgbMatches = bodyBg.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
                    if (rgbMatches) {
                        const r = parseInt(rgbMatches[1]).toString(16).padStart(2, '0');
                        const g = parseInt(rgbMatches[2]).toString(16).padStart(2, '0');
                        const b = parseInt(rgbMatches[3]).toString(16).padStart(2, '0');
                        baseColor = `#${r}${g}${b}`;
                    }
                }
            } else if (bodyBg.startsWith('#') || bodyBg.startsWith('rgb')) {
                // 如果是纯色背景
                baseColor = bodyBg;
            }
        }
        
        // 生成适合模态框的背景色
        const modalBgColor = Utils.lightenColorForModal(baseColor);
        
        // 应用到所有模态框
        const modalContents = document.querySelectorAll('.modal-content.glass-effect');
        modalContents.forEach(content => {
            content.style.backgroundColor = modalBgColor;
            content.style.background = modalBgColor;
        });
        
        // 更新glass-effect类的样式
        let glassStyle = document.getElementById('glass-effect-style');
        if (!glassStyle) {
            glassStyle = document.createElement('style');
            glassStyle.id = 'glass-effect-style';
            document.head.appendChild(glassStyle);
        }
        
        glassStyle.textContent = `
            .glass-effect {
                background: ${modalBgColor} !important;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
        `;
    },
    
    // 同步颜色选择器的值
    syncColorPickers(pageBgColor, fontColor) {
        // 更新页面底色选择器
        const pageBgColorPicker = document.getElementById('pageBgColor');
        const pageBgColorPreview = document.getElementById('pageBgColorPreview');
        const pageBgColorValue = document.getElementById('pageBgColorValue');
        
        if (pageBgColorPicker) pageBgColorPicker.value = pageBgColor;
        if (pageBgColorPreview) pageBgColorPreview.style.backgroundColor = pageBgColor;
        if (pageBgColorValue) pageBgColorValue.textContent = pageBgColor;
        
        // 更新标题颜色选择器
        const fontColorPicker = document.getElementById('fontColor');
        const fontColorPreview = document.getElementById('fontColorPreview');
        const fontColorValue = document.getElementById('fontColorValue');
        
        if (fontColorPicker) fontColorPicker.value = fontColor;
        if (fontColorPreview) fontColorPreview.style.backgroundColor = fontColor;
        if (fontColorValue) fontColorValue.textContent = fontColor;
    },
    
    // 初始化设置面板事件
    initSettingsPanel() {
        // 页面标题设置
        const pageTitleInput = document.getElementById('pageTitleInput');
        if (pageTitleInput) {
            pageTitleInput.addEventListener('input', function() {
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle) {
                    pageTitle.innerText = this.value;
                    localStorage.setItem('pageTitle', this.value);
                }
            });
        }
        
        // 点击页面标题时显示设置面板（只在编辑模式下）
        document.addEventListener('click', (e) => {
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle && e.target === pageTitle) {
                if (window.isEditMode) {
                    const settingsModal = document.getElementById('settingsModal');
                    if (settingsModal && typeof UI !== 'undefined' && typeof UI.showBodyBlur === 'function') {
                        settingsModal.style.display = 'block';
                        UI.showBodyBlur();
                    }
                }
            }
        });
        
        // 字体设置
        const fontFamily = document.getElementById('fontFamily');
        if (fontFamily) {
            fontFamily.addEventListener('change', function() {
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle) {
                    pageTitle.style.fontFamily = this.value;
                    localStorage.setItem('titleFontFamily', this.value);
                }
            });
        }
        
        // 字号设置
        const fontSize = document.getElementById('fontSize');
        if (fontSize) {
            fontSize.addEventListener('input', function() {
                const size = this.value + 'px';
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle) {
                    pageTitle.style.fontSize = size;
                }
                const fontSizeValue = document.getElementById('fontSizeValue');
                if (fontSizeValue) {
                    fontSizeValue.textContent = size;
                }
                localStorage.setItem('titleFontSize', this.value);
            });
        }
        
        // 字体颜色设置
        const fontColor = document.getElementById('fontColor');
        if (fontColor) {
            fontColor.addEventListener('input', function() {
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle) {
                    pageTitle.style.color = this.value;
                }
                localStorage.setItem('titleFontColor', this.value);
                // 更新颜色预览
                const fontColorPreview = document.getElementById('fontColorPreview');
                if (fontColorPreview) {
                    fontColorPreview.style.backgroundColor = this.value;
                }
                const fontColorValue = document.getElementById('fontColorValue');
                if (fontColorValue) {
                    fontColorValue.textContent = this.value;
                }
            });
        }
        
        // 页面底色设置
        const pageBgColor = document.getElementById('pageBgColor');
        if (pageBgColor) {
            pageBgColor.addEventListener('input', function() {
                // 获取当前渐变角度
                const gradientAngle = document.getElementById('gradientAngle');
                const angle = gradientAngle ? gradientAngle.value : '90';
                
                // 生成渐变背景
                const gradient = Utils.generateGradientFromColor(this.value, angle);
                document.body.style.background = gradient;
                
                // 保存到localStorage
                localStorage.setItem('pageBgColor', this.value);
                localStorage.setItem('pageBgGradient', gradient);
                
                // 更新颜色预览
                const pageBgColorPreview = document.getElementById('pageBgColorPreview');
                if (pageBgColorPreview) {
                    pageBgColorPreview.style.backgroundColor = this.value;
                }
                const pageBgColorValue = document.getElementById('pageBgColorValue');
                if (pageBgColorValue) {
                    pageBgColorValue.textContent = this.value;
                }
                
                // 更新模态框背景色
                if (typeof UI !== 'undefined' && typeof UI.updateModalBackgroundColor === 'function') {
                    UI.updateModalBackgroundColor();
                }
            });
        }
        
        // 渐变角度设置
        const gradientAngle = document.getElementById('gradientAngle');
        const gradientAngleValue = document.getElementById('gradientAngleValue');
        if (gradientAngle && gradientAngleValue) {
            gradientAngle.addEventListener('input', function() {
                // 更新角度显示
                gradientAngleValue.textContent = this.value + '°';
                
                // 获取当前背景色
                const pageBgColor = document.getElementById('pageBgColor');
                const color = pageBgColor ? pageBgColor.value : '#333333';
                
                // 生成新的渐变背景
                const gradient = Utils.generateGradientFromColor(color, this.value);
                document.body.style.background = gradient;
                
                // 保存到localStorage
                localStorage.setItem('gradientAngle', this.value);
                localStorage.setItem('pageBgGradient', gradient);
                
                // 更新模态框背景色
                if (typeof UI !== 'undefined' && typeof UI.updateModalBackgroundColor === 'function') {
                    UI.updateModalBackgroundColor();
                }
            });
        }
        
        // UI幻化功能 - 图片上传处理
        const imageUpload = document.getElementById('imageUpload');
        const colorPalettePreview = document.getElementById('colorPalettePreview');
        const colorPalette = document.getElementById('colorPalette');
        const applyColorSchemeBtn = document.getElementById('applyColorScheme');

        if (imageUpload && colorPalettePreview && colorPalette && applyColorSchemeBtn) {
            imageUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        // 显示加载状态
                        colorPalettePreview.style.display = 'block';
                        colorPalette.innerHTML = '<div style="text-align:center;padding:5px;">正在分析图片颜色...</div>';
                        applyColorSchemeBtn.style.display = 'none';
                        
                        // 提取颜色
                        const colors = await UIMagic.extractColorsFromImage(e.target.result);
                        
                        // 显示颜色调色板
                        colorPalette.innerHTML = '';
                        colorPalette.style.display = 'flex';
                        colorPalette.style.flexWrap = 'nowrap';
                        colorPalette.style.overflowX = 'auto';
                        colorPalette.style.justifyContent = 'flex-start';
                        colorPalette.style.gap = '5px';
                        colorPalette.style.padding = '5px';
                        colorPalette.style.alignItems = 'center';
                        
                        colors.forEach(color => {
                            const colorItem = document.createElement('div');
                            colorItem.className = 'color-item';
                            colorItem.style.cssText = `
                                width: 30px;
                                height: 30px;
                                background-color: ${color.hex};
                                border-radius: 4px;
                                cursor: pointer;
                                border: 1px solid rgba(255, 255, 255, 0.5);
                                transition: all 0.3s ease;
                                flex-shrink: 0;
                                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                            `;
                            colorItem.title = color.hex;
                            colorItem.addEventListener('click', function() {
                                // 选中颜色时的反馈
                                this.style.transform = 'scale(1.2)';
                                this.style.boxShadow = '0 0 0 2px white, 0 0 5px rgba(255,255,255,0.8)';
                                setTimeout(() => {
                                    this.style.transform = 'scale(1)';
                                    this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
                                }, 300);
                            });
                            colorPalette.appendChild(colorItem);
                        });
                        
                        // 保存提取的颜色以供应用
                        imageUpload.extractedColors = colors;
                        
                        // 显示应用按钮
                        applyColorSchemeBtn.style.display = 'block';
                        applyColorSchemeBtn.style.marginTop = '10px';
                        applyColorSchemeBtn.style.padding = '8px 16px';
                        applyColorSchemeBtn.style.width = '100%';
                        
                    } catch (error) {
                        console.error('图片处理错误:', error);
                        colorPalette.innerHTML = '<div style="color:#ff6666;text-align:center;padding:10px;">颜色分析失败，请重试</div>';
                        applyColorSchemeBtn.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            });
            
            // 应用配色方案按钮
            applyColorSchemeBtn.addEventListener('click', function() {
                if (imageUpload.extractedColors && imageUpload.extractedColors.length > 0) {
                    const colorScheme = UIMagic.generateColorScheme(imageUpload.extractedColors);
                    UIMagic.applyColorScheme(colorScheme);
                    
                    // 显示成功消息
                    const originalText = this.textContent;
                    this.textContent = '配色已应用！';
                    this.style.background = 'rgba(100, 200, 100, 0.7)';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                    }, 2000);
                }
            });
        }
        
        // 重置样式按钮
        const resetStylesBtn = document.getElementById('resetStyles');
        if (resetStylesBtn) {
            resetStylesBtn.addEventListener('click', function() {
                if (typeof Styles !== 'undefined' && typeof Styles.resetTitleStyles === 'function') {
                    Styles.resetTitleStyles();
                }
                
                // 重置页面背景色和渐变角度控件
                const pageBgColor = document.getElementById('pageBgColor');
                const pageBgColorPreview = document.getElementById('pageBgColorPreview');
                const pageBgColorValue = document.getElementById('pageBgColorValue');
                const gradientAngle = document.getElementById('gradientAngle');
                const gradientAngleValue = document.getElementById('gradientAngleValue');
                
                if (pageBgColor) pageBgColor.value = '#333333';
                if (pageBgColorPreview) pageBgColorPreview.style.backgroundColor = '#333333';
                if (pageBgColorValue) pageBgColorValue.textContent = '#333333';
                if (gradientAngle) gradientAngle.value = '90';
                if (gradientAngleValue) gradientAngleValue.textContent = '90°';
                
                // 更新模态框背景色
                if (typeof UI !== 'undefined' && typeof UI.updateModalBackgroundColor === 'function') {
                    UI.updateModalBackgroundColor();
                }
            });
        }
        
        // 初始隐藏设置面板
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.style.display = 'none';
        }
        
        // 初始更新模态框背景色
        if (typeof UI !== 'undefined' && typeof UI.updateModalBackgroundColor === 'function') {
            UI.updateModalBackgroundColor();
        }
    },
    
    // 初始化编辑模式切换
    initEditModeToggle() {
        const toggleBtn = document.getElementById('editModeToggle');
        
        // 设置初始按钮文本
        if (toggleBtn) {
            toggleBtn.textContent = '编辑模式';
        }
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                window.isEditMode = !window.isEditMode;
                
                if (window.isEditMode) {
                    // 进入编辑模式
                    toggleBtn.textContent = '退出编辑';
                    toggleBtn.classList.add('edit-mode');
                    // 显示编辑按钮
                    const addSectionBtn = document.getElementById('addSectionBtn');
                    const importConfigBtn = document.getElementById('importConfigBtn');
                    const exportConfigBtn = document.getElementById('exportConfigBtn');
                    
                    if (addSectionBtn) addSectionBtn.style.display = 'inline-block';
                    if (importConfigBtn) importConfigBtn.style.display = 'inline-block';
                    if (exportConfigBtn) exportConfigBtn.style.display = 'inline-block';
                    
                    const headerControls = document.querySelector('.header-controls');
                    if (headerControls) headerControls.classList.add('editing');
                    
                    // 重新渲染分组以显示编辑UI
                    if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                        Renderer.renderSections();
                    }
                } else {
                    // 退出编辑模式
                    toggleBtn.textContent = '编辑模式';
                    toggleBtn.classList.remove('edit-mode');
                    // 隐藏编辑按钮
                    const addSectionBtn = document.getElementById('addSectionBtn');
                    const importConfigBtn = document.getElementById('importConfigBtn');
                    const exportConfigBtn = document.getElementById('exportConfigBtn');
                    
                    if (addSectionBtn) addSectionBtn.style.display = 'none';
                    if (importConfigBtn) importConfigBtn.style.display = 'none';
                    if (exportConfigBtn) exportConfigBtn.style.display = 'none';
                    
                    const headerControls = document.querySelector('.header-controls');
                    if (headerControls) headerControls.classList.remove('editing');
                    
                    // 重新渲染分组以隐藏编辑UI
                    if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                        Renderer.renderSections();
                    }
                }
            });
        }
    },
    
    // 初始化导入/导出功能
    initImportExportFunctions() {
        // 导出配置功能
        const exportConfigBtn = document.getElementById('exportConfigBtn');
        if (exportConfigBtn) {
            exportConfigBtn.addEventListener('click', () => {
                // 获取当前的所有配置数据
                const configData = {
                    pageTitle: document.getElementById('pageTitle').innerText,
                    titleFontFamily: document.getElementById('pageTitle').style.fontFamily || 'Arial, sans-serif',
                    titleFontSize: document.getElementById('pageTitle').style.fontSize || '56px',
                    titleFontColor: document.getElementById('pageTitle').style.color || '#ffffff',
                    pageBgColor: document.body.style.backgroundColor || '#333333',
                    pageBgGradient: document.body.style.background || localStorage.getItem('pageBgGradient'),
                    gradientAngle: localStorage.getItem('gradientAngle') || '90',
                    sectionsData: typeof window.sectionsData !== 'undefined' ? window.sectionsData : []
                };
                
                // 创建下载链接
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configData, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "navigation_config.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            });
        }

        // 导入配置功能
        const importConfigBtn = document.getElementById('importConfigBtn');
        const importConfigInput = document.getElementById('importConfigInput');
        if (importConfigBtn && importConfigInput) {
            importConfigBtn.addEventListener('click', () => {
                importConfigInput.click();
            });

            importConfigInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const configData = JSON.parse(e.target.result);
                        
                        // 确认是否要导入配置
                        if (!confirm('导入配置将覆盖当前所有设置，确定要继续吗？')) {
                            importConfigInput.value = '';
                            return;
                        }
                        
                        // 恢复配置数据
                        const pageTitle = document.getElementById('pageTitle');
                        const pageTitleInput = document.getElementById('pageTitleInput');
                        if (configData.pageTitle && pageTitle && pageTitleInput) {
                            pageTitle.innerText = configData.pageTitle;
                            pageTitleInput.value = configData.pageTitle;
                            localStorage.setItem('pageTitle', configData.pageTitle);
                        }
                        
                        const fontFamily = document.getElementById('fontFamily');
                        if (configData.titleFontFamily && pageTitle && fontFamily) {
                            pageTitle.style.fontFamily = configData.titleFontFamily;
                            fontFamily.value = configData.titleFontFamily;
                            localStorage.setItem('titleFontFamily', configData.titleFontFamily);
                        }
                        
                        const fontSize = document.getElementById('fontSize');
                        const fontSizeValue = document.getElementById('fontSizeValue');
                        if (configData.titleFontSize && pageTitle && fontSize && fontSizeValue) {
                            pageTitle.style.fontSize = configData.titleFontSize;
                            const fontSizeNum = configData.titleFontSize.replace('px', '');
                            fontSize.value = fontSizeNum;
                            fontSizeValue.textContent = configData.titleFontSize;
                            localStorage.setItem('titleFontSize', fontSizeNum);
                        }
                        
                        const fontColor = document.getElementById('fontColor');
                        const fontColorPreview = document.getElementById('fontColorPreview');
                        const fontColorValue = document.getElementById('fontColorValue');
                        if (configData.titleFontColor && pageTitle && fontColor && fontColorPreview && fontColorValue) {
                            pageTitle.style.color = configData.titleFontColor;
                            const formattedFontColor = typeof Styles !== 'undefined' && typeof Styles.formatColorValue === 'function' 
                                ? Styles.formatColorValue(configData.titleFontColor) 
                                : configData.titleFontColor;
                            fontColor.value = formattedFontColor;
                            fontColorPreview.style.backgroundColor = formattedFontColor;
                            fontColorValue.textContent = formattedFontColor;
                            localStorage.setItem('titleFontColor', configData.titleFontColor);
                        }
                        
                        // 加载渐变角度
                        const gradientAngle = document.getElementById('gradientAngle');
                        const gradientAngleValue = document.getElementById('gradientAngleValue');
                        if (configData.gradientAngle && gradientAngle && gradientAngleValue) {
                            gradientAngle.value = configData.gradientAngle;
                            gradientAngleValue.textContent = configData.gradientAngle + '°';
                            localStorage.setItem('gradientAngle', configData.gradientAngle);
                        }
                        
                        // 应用渐变背景
                        if (configData.pageBgGradient) {
                            document.body.style.background = configData.pageBgGradient;
                            localStorage.setItem('pageBgGradient', configData.pageBgGradient);
                            localStorage.setItem('pageBgColor', configData.pageBgColor || '#333333');
                        } else if (configData.pageBgColor) {
                            // 如果没有渐变背景但有颜色，则生成渐变
                            const angle = configData.gradientAngle || '90';
                            const gradient = Utils.generateGradientFromColor(configData.pageBgColor, angle);
                            document.body.style.background = gradient;
                            localStorage.setItem('pageBgColor', configData.pageBgColor);
                            localStorage.setItem('pageBgGradient', gradient);
                            localStorage.setItem('gradientAngle', angle);
                        }
                        
                        if (configData.sectionsData && typeof window.sectionsData !== 'undefined') {
                            window.sectionsData = configData.sectionsData;
                            // 保存数据
                            localStorage.setItem('sectionsData', JSON.stringify(window.sectionsData));
                            // 重新渲染
                            if (typeof Renderer !== 'undefined' && typeof Renderer.renderSections === 'function') {
                                Renderer.renderSections();
                            }
                        }
                        
                        // 更新模态框背景色
                        UI.updateModalBackgroundColor();
                        
                        // 重置文件输入
                        importConfigInput.value = '';
                        
                        alert('配置导入成功！');
                    } catch (error) {
                        console.error('导入配置时出错:', error);
                        alert('配置文件格式错误，请选择有效的配置文件。');
                        importConfigInput.value = '';
                    }
                };
                reader.readAsText(file);
            });
        }
    },
    
    // 添加编辑覆盖层
    addEditOverlays() {
        document.querySelectorAll('.link-item').forEach(item => {
            // 检查是否是添加链接按钮，如果是则跳过
            if (item.querySelector('.add-link-placeholder')) {
                return;
            }
            
            item.classList.add('edit-mode');
            
            // 添加编辑覆盖层
            if (!item.querySelector('.link-edit-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'link-edit-overlay';
                overlay.innerHTML = `
                    <button class="edit-link-btn">编辑</button>
                    <button class="delete-link-btn">删除</button>
                `;
                item.appendChild(overlay);
            }
        });
        
        // 重新绑定事件
        setTimeout(() => {
            if (typeof Links !== 'undefined' && typeof Links.bindEditDeleteEvents === 'function') {
                Links.bindEditDeleteEvents();
            }
        }, 10);
    },
    
    // 移除编辑覆盖层
    removeEditOverlays() {
        document.querySelectorAll('.link-item').forEach(item => {
            item.classList.remove('edit-mode');
            
            // 移除编辑覆盖层
            const overlay = item.querySelector('.link-edit-overlay');
            if (overlay) {
                overlay.remove();
            }
        });
    },
    
    // 显示链接编辑模态框
    showLinkEditModal(linkData, linkId) {
        const modal = document.getElementById('linkEditModal');
        const urlInput = document.getElementById('editLinkUrl');
        const nameInput = document.getElementById('editLinkName');
        const iconInput = document.getElementById('editLinkIcon');
        const modalTitle = document.getElementById('linkModalTitle');
        const submitBtn = modal ? modal.querySelector('button[type="submit"]') : null;
        
        if (linkData && modal && urlInput && nameInput && iconInput && modalTitle && submitBtn) {
            // 编辑模式
            modalTitle.textContent = '编辑链接';
            submitBtn.textContent = '保存';
            urlInput.value = linkData.url;
            nameInput.value = linkData.name;
            iconInput.value = linkData.icon || '';
            modal.dataset.editMode = 'edit';
            modal.dataset.linkId = linkId;
        } else if (modal && urlInput && nameInput && iconInput && modalTitle && submitBtn) {
            // 添加模式
            modalTitle.textContent = '添加链接';
            submitBtn.textContent = '添加';
            urlInput.value = '';
            nameInput.value = '';
            iconInput.value = '';
            iconInput.placeholder = '可留空，将自动获取网站图标';
            modal.dataset.editMode = 'add';
            delete modal.dataset.linkId;
        }
        
        if (modal) {
            modal.style.display = 'block';
            this.showBodyBlur();
        }
        
        // 确保模态框背景色与当前页面背景匹配
        this.updateModalBackgroundColor();
    },
    
    // 显示分组编辑模态框
    showSectionEditModal(sectionData) {
        const modal = document.getElementById('sectionEditModal');
        const titleInput = document.getElementById('editSectionTitle');
        const colorInput = document.getElementById('editSectionBgColor');
        const deleteBtn = document.getElementById('deleteSectionBtn');
        const modalTitle = document.getElementById('sectionModalTitle');
        const submitBtn = modal ? modal.querySelector('button[type="submit"]') : null;
        
        // 清理之前可能存在的事件监听器
        if (colorInput) {
            const newColorInput = colorInput.cloneNode(true);
            colorInput.parentNode.replaceChild(newColorInput, colorInput);
            const colorInputUpdated = document.getElementById('editSectionBgColor');
            
            // 保存原始颜色值，用于取消操作时恢复
            let originalBgColor = null;
            let originalButtonColor = null;
            let currentSectionId = null;
            
            if (sectionData && modal && titleInput && colorInputUpdated && deleteBtn && modalTitle && submitBtn) {
                // 编辑模式
                modalTitle.textContent = '编辑分组';
                submitBtn.textContent = '保存';
                titleInput.value = sectionData.title;
                const formattedColor = typeof Styles !== 'undefined' && typeof Styles.formatColorValue === 'function' 
                    ? Styles.formatColorValue(sectionData.backgroundColor) 
                    : sectionData.backgroundColor;
                colorInputUpdated.value = formattedColor;
                originalBgColor = sectionData.backgroundColor;
                originalButtonColor = sectionData.linkButtonColor || Utils.lightenColor(sectionData.backgroundColor, 20);
                currentSectionId = sectionData.id;
                modal.dataset.editMode = 'edit';
                modal.dataset.sectionId = sectionData.id;
                
                // 显示删除按钮（如果不是最后一个分组）
                deleteBtn.style.display = typeof window.sectionsData !== 'undefined' && window.sectionsData.length > 1 ? 'block' : 'none';
            } else if (modal && titleInput && colorInputUpdated && deleteBtn && modalTitle && submitBtn) {
                // 添加模式
                modalTitle.textContent = '添加分组';
                submitBtn.textContent = '添加';
                titleInput.value = '新分组';
                colorInputUpdated.value = '#444444';
                currentSectionId = null;
                modal.dataset.editMode = 'add';
                delete modal.dataset.sectionId;
                
                // 隐藏删除按钮
                deleteBtn.style.display = 'none';
            }
            
            // 更新颜色预览
            const editSectionColorPreview = document.getElementById('editSectionColorPreview');
            const editSectionColorValue = document.getElementById('editSectionColorValue');
            if (editSectionColorPreview) {
                editSectionColorPreview.style.backgroundColor = colorInputUpdated.value;
            }
            if (editSectionColorValue) {
                editSectionColorValue.textContent = colorInputUpdated.value;
            }
            
            // 添加颜色实时预览功能
            colorInputUpdated.addEventListener('input', function() {
                const selectedColor = this.value;
                
                // 更新颜色预览
                if (editSectionColorPreview) {
                    editSectionColorPreview.style.backgroundColor = selectedColor;
                }
                if (editSectionColorValue) {
                    editSectionColorValue.textContent = selectedColor;
                }
                
                // 如果是编辑模式，实时更新分组预览
                if (modal.dataset.editMode === 'edit' && currentSectionId) {
                    // 更新分组背景色（带透明度）
                    const sectionElement = document.querySelector(`.links-section[data-section-id="${currentSectionId}"]`);
                    if (sectionElement) {
                        sectionElement.style.backgroundColor = Utils.convertToRGBA(selectedColor, 0.25);
                    }
                    
                    // 计算并更新按钮颜色
                    const buttonColor = Utils.lightenColor(selectedColor, 20);
                    if (typeof Styles !== 'undefined' && typeof Styles.updateSectionLinkButtonStyle === 'function') {
                        Styles.updateSectionLinkButtonStyle(currentSectionId, buttonColor);
                    }
                }
            });
        }
        
        if (modal) {
            modal.style.display = 'block';
            this.showBodyBlur();
        }
        
        // 确保模态框背景色与当前页面背景匹配
        this.updateModalBackgroundColor();
    },
    
    // 通用关闭模态框函数
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            this.hideBodyBlur();
        }
    }
};

// 全局编辑模式变量
window.isEditMode = false;

// 显示自定义确认对话框
UI.showConfirmModal = function(message, onConfirm, onCancel) {
    // 如果已经存在确认模态框，先移除它
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 创建确认模态框
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal';
    confirmModal.id = 'confirmModal';
    confirmModal.style.zIndex = '1003'; // 确保在其他模态框之上
    
    confirmModal.innerHTML = `
        <div class="modal-content glass-effect" style="max-width: 400px;">
            <div class="modal-header">
                <h3>确认操作</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px; padding: 15px;">
                <button id="confirmCancelBtn" class="glass-button secondary" style="min-width: 80px;">取消</button>
                <button id="confirmOkBtn" class="glass-button primary" style="min-width: 80px;">确定</button>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(confirmModal);
    
    // 显示模态框
    confirmModal.style.display = 'block';
    UI.showBodyBlur();
    
    // 获取关闭按钮
    const closeBtn = confirmModal.querySelector('.close');
    const okBtn = document.getElementById('confirmOkBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    
    // 定义关闭函数
    const closeConfirmModal = function() {
        confirmModal.style.display = 'none';
        UI.hideBodyBlur();
        confirmModal.remove();
    };
    
    // 绑定事件
    if (okBtn) {
        okBtn.addEventListener('click', function() {
            if (onConfirm && typeof onConfirm === 'function') {
                onConfirm();
            }
            closeConfirmModal();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (onCancel && typeof onCancel === 'function') {
                onCancel();
            }
            closeConfirmModal();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (onCancel && typeof onCancel === 'function') {
                onCancel();
            }
            closeConfirmModal();
        });
    }
    
    // 点击模态框外部关闭
    confirmModal.addEventListener('click', function(e) {
        if (e.target === this) {
            if (onCancel && typeof onCancel === 'function') {
                onCancel();
            }
            closeConfirmModal();
        }
    });
    
    // ESC键关闭
    const handleEsc = function(e) {
        if (e.key === 'Escape') {
            if (onCancel && typeof onCancel === 'function') {
                onCancel();
            }
            closeConfirmModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    
    document.addEventListener('keydown', handleEsc);
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有UI组件
    if (typeof UI !== 'undefined') {
        UI.initSettingsPanel();
        UI.initEditModeToggle();
        UI.initImportExportFunctions();
    }
    
    // 监听分组背景色变化事件
    document.addEventListener('sectionBackgroundColorChanged', function(e) {
        // 当分组背景色改变时，更新该分组内链接按钮的颜色
        const section = e.target;
        const backgroundColor = e.detail.color;
        
        // 这里可以添加更新链接按钮颜色的逻辑
        // 如果原项目已有相关功能，这里会自动触发
    });
});