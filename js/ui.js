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
    
    // 初始化设置面板事件
    initSettingsPanel() {
        // 页面标题设置
        document.getElementById('pageTitleInput').addEventListener('input', function() {
            document.getElementById('pageTitle').innerText = this.value;
            localStorage.setItem('pageTitle', this.value);
        });
        
        // 点击页面标题时显示设置面板（只在编辑模式下）
        document.getElementById('pageTitle').addEventListener('click', (e) => {
            if (isEditMode) {
                document.getElementById('settingsModal').style.display = 'block';
                this.showBodyBlur();
            }
        });
        
        // 字体设置
        document.getElementById('fontFamily').addEventListener('change', function() {
            document.getElementById('pageTitle').style.fontFamily = this.value;
            localStorage.setItem('titleFontFamily', this.value);
        });
        
        // 字号设置
        document.getElementById('fontSize').addEventListener('input', function() {
            const size = this.value + 'px';
            document.getElementById('pageTitle').style.fontSize = size;
            document.getElementById('fontSizeValue').textContent = size;
            localStorage.setItem('titleFontSize', this.value);
        });
        
        // 字体颜色设置
        document.getElementById('fontColor').addEventListener('input', function() {
            document.getElementById('pageTitle').style.color = this.value;
            localStorage.setItem('titleFontColor', this.value);
            // 更新颜色预览
            document.getElementById('fontColorPreview').style.backgroundColor = this.value;
            document.getElementById('fontColorValue').textContent = this.value;
        });
        
        // 页面背景色设置 - 修改为使用渐变背景
        document.getElementById('pageBgColor').addEventListener('input', function() {
            const selectedColor = this.value;
            // 获取当前角度设置
            const angle = localStorage.getItem('gradientAngle') || '90';
            // 生成渐变背景
            const gradient = Utils.generateGradientFromColor(selectedColor, angle);
            document.body.style.background = gradient;
            localStorage.setItem('pageBgColor', selectedColor);
            localStorage.setItem('pageBgGradient', gradient); // 保存渐变色
            
            // 更新颜色预览
            document.getElementById('pageBgColorPreview').style.backgroundColor = selectedColor;
            document.getElementById('pageBgColorValue').textContent = selectedColor;
            
            // 更新模态框背景色
            UI.updateModalBackgroundColor();
        });
        
        // 渐变角度设置
        document.getElementById('gradientAngle').addEventListener('input', function() {
            const angle = this.value;
            const selectedColor = document.getElementById('pageBgColor').value;
            // 生成渐变背景
            const gradient = Utils.generateGradientFromColor(selectedColor, angle);
            document.body.style.background = gradient;
            localStorage.setItem('gradientAngle', angle);
            document.getElementById('gradientAngleValue').textContent = angle + '°';
            localStorage.setItem('pageBgGradient', gradient); // 保存渐变色
            
            // 更新模态框背景色
            UI.updateModalBackgroundColor();
        });
        
        // 重置样式
        document.getElementById('resetStyles').addEventListener('click', (e) => {
            e.stopPropagation();
            Styles.resetTitleStyles();
        });
        
        // 页面设置模态框关闭事件
        const closeButtons = document.querySelectorAll('.modal .close');
        if (closeButtons.length > 0) {
            closeButtons[0].addEventListener('click', () => {
                this.closeModal('settingsModal');
            });
        }
        
        // 初始隐藏设置面板
        document.getElementById('settingsModal').style.display = 'none';
        
        // 初始更新模态框背景色
        this.updateModalBackgroundColor();
    },
    
    // 初始化编辑模式切换
    initEditModeToggle() {
        const toggleBtn = document.getElementById('editModeToggle');
        
        // 设置初始按钮文本
        toggleBtn.textContent = '✏️ 编辑模式';
        
        toggleBtn.addEventListener('click', () => {
            isEditMode = !isEditMode;
            
            if (isEditMode) {
                // 进入编辑模式
                toggleBtn.textContent = '✏️ 退出编辑';
                toggleBtn.classList.add('edit-mode');
            } else {
                // 退出编辑模式
                toggleBtn.textContent = '✏️ 编辑模式';
                toggleBtn.classList.remove('edit-mode');
            }
            
            // 重新渲染所有分组以更新编辑模式UI
            Renderer.renderSections();
        });
    },
    
    // 初始化导入/导出功能
    initImportExportFunctions() {
        // 导出配置功能
        document.getElementById('exportConfigBtn').addEventListener('click', () => {
            // 获取当前的所有配置数据
            const configData = {
                pageTitle: document.getElementById('pageTitle').innerText,
                titleFontFamily: document.getElementById('pageTitle').style.fontFamily || 'Arial, sans-serif',
                titleFontSize: document.getElementById('pageTitle').style.fontSize || '56px',
                titleFontColor: document.getElementById('pageTitle').style.color || '#ffffff',
                pageBgColor: document.body.style.backgroundColor || '#333333',
                pageBgGradient: document.body.style.background || localStorage.getItem('pageBgGradient'),
                gradientAngle: localStorage.getItem('gradientAngle') || '90',
                sectionsData: sectionsData
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

        // 导入配置功能
        document.getElementById('importConfigBtn').addEventListener('click', () => {
            document.getElementById('importConfigInput').click();
        });

        document.getElementById('importConfigInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const configData = JSON.parse(e.target.result);
                    
                    // 确认是否要导入配置
                    if (!confirm('导入配置将覆盖当前所有设置，确定要继续吗？')) {
                        document.getElementById('importConfigInput').value = '';
                        return;
                    }
                    
                    // 恢复配置数据
                    if (configData.pageTitle) {
                        document.getElementById('pageTitle').innerText = configData.pageTitle;
                        document.getElementById('pageTitleInput').value = configData.pageTitle;
                        localStorage.setItem('pageTitle', configData.pageTitle);
                    }
                    
                    if (configData.titleFontFamily) {
                        document.getElementById('pageTitle').style.fontFamily = configData.titleFontFamily;
                        document.getElementById('fontFamily').value = configData.titleFontFamily;
                        localStorage.setItem('titleFontFamily', configData.titleFontFamily);
                    }
                    
                    if (configData.titleFontSize) {
                        document.getElementById('pageTitle').style.fontSize = configData.titleFontSize;
                        const fontSizeValue = configData.titleFontSize.replace('px', '');
                        document.getElementById('fontSize').value = fontSizeValue;
                        document.getElementById('fontSizeValue').textContent = configData.titleFontSize;
                        localStorage.setItem('titleFontSize', fontSizeValue);
                    }
                    
                    if (configData.titleFontColor) {
                        document.getElementById('pageTitle').style.color = configData.titleFontColor;
                        const formattedFontColor = Styles.formatColorValue(configData.titleFontColor);
                        document.getElementById('fontColor').value = formattedFontColor;
                        document.getElementById('fontColorPreview').style.backgroundColor = formattedFontColor;
                        document.getElementById('fontColorValue').textContent = formattedFontColor;
                        localStorage.setItem('titleFontColor', configData.titleFontColor);
                    }
                    
                    // 加载渐变角度
                    if (configData.gradientAngle) {
                        document.getElementById('gradientAngle').value = configData.gradientAngle;
                        document.getElementById('gradientAngleValue').textContent = configData.gradientAngle + '°';
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
                    
                    if (configData.sectionsData) {
                        sectionsData = configData.sectionsData;
                        Data.saveSectionsData();
                        Renderer.renderSections();
                    }
                    
                    // 更新模态框背景色
                    UI.updateModalBackgroundColor();
                    
                    // 重置文件输入
                    document.getElementById('importConfigInput').value = '';
                    
                    alert('配置导入成功！');
                } catch (error) {
                    console.error('导入配置时出错:', error);
                    alert('配置文件格式错误，请选择有效的配置文件。');
                    document.getElementById('importConfigInput').value = '';
                }
            };
            reader.readAsText(file);
        });
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
            Links.bindEditDeleteEvents();
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
        const submitBtn = modal.querySelector('button[type="submit"]');
        
        if (linkData) {
            // 编辑模式
            modalTitle.textContent = '编辑链接';
            submitBtn.textContent = '保存';
            urlInput.value = linkData.url;
            nameInput.value = linkData.name;
            iconInput.value = linkData.icon || '';
            modal.dataset.editMode = 'edit';
            modal.dataset.linkId = linkId;
        } else {
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
        
        modal.style.display = 'block';
        this.showBodyBlur();
        
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
        const submitBtn = modal.querySelector('button[type="submit"]');
        
        // 保存原始颜色值，用于取消操作时恢复
        let originalBgColor = null;
        let originalButtonColor = null;
        
        if (sectionData) {
            // 编辑模式
            modalTitle.textContent = '编辑分组';
            submitBtn.textContent = '保存';
            titleInput.value = sectionData.title;
            const formattedColor = Styles.formatColorValue(sectionData.bgColor);
            colorInput.value = formattedColor;
            originalBgColor = sectionData.bgColor;
            originalButtonColor = sectionData.linkButtonColor || Utils.lightenColor(sectionData.bgColor, 20);
            modal.dataset.editMode = 'edit';
            modal.dataset.sectionId = sectionData.id;
            
            // 显示删除按钮（如果不是最后一个分组）
            deleteBtn.style.display = sectionsData.length > 1 ? 'block' : 'none';
        } else {
            // 添加模式
            modalTitle.textContent = '添加分组';
            submitBtn.textContent = '添加';
            titleInput.value = '新分组';
            colorInput.value = '#444444';
            modal.dataset.editMode = 'add';
            delete modal.dataset.sectionId;
            
            // 隐藏删除按钮
            deleteBtn.style.display = 'none';
        }
        
        // 更新颜色预览
        document.getElementById('editSectionColorPreview').style.backgroundColor = colorInput.value;
        document.getElementById('editSectionColorValue').textContent = colorInput.value;
        
        // 实时更新分组背景色和按钮颜色（仅在编辑模式下）
        const colorInputHandler = function() {
            const newColor = this.value;
            
            // 更新颜色预览
            document.getElementById('editSectionColorPreview').style.backgroundColor = newColor;
            document.getElementById('editSectionColorValue').textContent = newColor;
            
            // 如果是编辑模式，实时更新分组背景色
            if (sectionData) {
                const sectionElement = document.querySelector(`.links-section[data-section-id="${sectionData.id}"]`);
                if (sectionElement) {
                    sectionElement.style.backgroundColor = newColor;
                    
                    // 实时更新该分组内链接按钮颜色（临时）
                    const lighterColor = Utils.lightenColor(newColor, 20);
                    Styles.updateSectionLinkButtonStyle(sectionData.id, lighterColor);
                }
            }
        };
        
        // 移除之前可能添加的事件监听器，避免重复绑定
        const newColorInput = colorInput.cloneNode(true);
        colorInput.parentNode.replaceChild(newColorInput, colorInput);
        
        // 添加实时预览功能
        newColorInput.addEventListener('input', colorInputHandler);
        
        // 监听模态框关闭事件，处理取消操作
        const handleModalClose = (e) => {
            // 检查是否是点击模态框外部或按ESC键关闭
            if ((e.target === modal || e.key === 'Escape') && sectionData && originalBgColor) {
                // 恢复分组背景色和链接按钮颜色到原始状态
                const sectionElement = document.querySelector(`.links-section[data-section-id="${sectionData.id}"]`);
                if (sectionElement) {
                    sectionElement.style.backgroundColor = originalBgColor;
                    
                    // 恢复链接按钮颜色
                    Styles.updateSectionLinkButtonStyle(sectionData.id, originalButtonColor);
                }
            }
            
            // 移除事件监听器
            window.removeEventListener('click', handleModalClose);
            window.removeEventListener('keydown', handleModalClose);
        };
        
        // 添加关闭事件监听器
        window.addEventListener('click', handleModalClose);
        window.addEventListener('keydown', handleModalClose);
        
        modal.style.display = 'block';
        this.showBodyBlur();
        
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