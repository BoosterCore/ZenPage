// 渲染模块
const Renderer = {
    // 渲染所有分组
    renderSections() {
        try {
            const sectionsContainer = document.getElementById('sectionsContainer');
            if (!sectionsContainer) {
                console.error('找不到sectionsContainer元素');
                return;
            }
            
            sectionsContainer.innerHTML = '';
            
            // 确保window.sectionsData存在且为数组
            if (!window.sectionsData || !Array.isArray(window.sectionsData)) {
                console.warn('sectionsData不存在或不是数组，创建默认分组');
                window.sectionsData = [{
                    id: 'default-section',
                    title: '默认分组',
                    backgroundColor: '#444444',
                    links: []
                }];
            }
            
            window.sectionsData.forEach((section, index) => {
                // 确保必需的属性存在
                if (!section.id) section.id = 'section' + (index + 1);
                if (!section.title) section.title = '新分组';
                if (!section.backgroundColor) section.backgroundColor = '#444444';
                if (!section.links) section.links = [];
                
                // 确保链接都有id属性
                section.links.forEach((link, linkIndex) => {
                    if (!link.id) {
                        link.id = `${section.id}-link-${linkIndex}`;
                    }
                });
                
                const sectionElement = document.createElement('div');
                sectionElement.className = 'links-section';
                sectionElement.dataset.sectionId = section.id;
                sectionElement.style.backgroundColor = Utils.convertToRGBA(section.backgroundColor, 0.25);
                sectionElement.setAttribute('draggable', window.isEditMode);
                
                sectionElement.innerHTML = `
                    <div class="section-header ${window.isEditMode ? 'drag-handle' : ''}">
                        <h2 class="section-title" contenteditable="false">${section.title}</h2>
                    </div>
                    <div class="links-grid" id="linksContainer-${section.id}">
                        <!-- 链接按钮将通过JavaScript渲染 -->
                    </div>
                `;
                
                sectionsContainer.appendChild(sectionElement);
                
                // 渲染该分组的链接
                this.renderLinksForSection(section.id, section.links);
                
                // 应用保存的链接按钮颜色或根据分组背景色计算
                let buttonColor = section.linkButtonColor || Utils.lightenColor(section.backgroundColor, 20);
                // 保存计算出的颜色
                if (!section.linkButtonColor) {
                    window.sectionsData[index].linkButtonColor = buttonColor;
                }
                if (typeof Styles !== 'undefined' && typeof Styles.updateSectionLinkButtonStyle === 'function') {
                    Styles.updateSectionLinkButtonStyle(section.id, buttonColor);
                }
            });
            
            // 根据编辑模式更新UI
            this.updateEditModeUI();
        } catch (error) {
            console.error('渲染分组时出错:', error);
            // 显示错误信息
            const sectionsContainer = document.getElementById('sectionsContainer');
            if (sectionsContainer) {
                sectionsContainer.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">内容加载失败，请检查控制台错误信息</div>';
            }
        }
    },
    
    // 根据编辑模式更新UI元素
    updateEditModeUI() {
        const addSectionBtn = document.getElementById('addSectionBtn');
        const importConfigBtn = document.getElementById('importConfigBtn');
        const exportConfigBtn = document.getElementById('exportConfigBtn');
        const pageTitle = document.getElementById('pageTitle');
        const sectionTitles = document.querySelectorAll('.section-title');
        const headerControls = document.querySelector('.header-controls');
        const sectionHeaders = document.querySelectorAll('.section-header');
        
        if (window.isEditMode) {
            // 显示编辑模式按钮
            if (addSectionBtn) addSectionBtn.style.display = 'inline-block';
            if (importConfigBtn) importConfigBtn.style.display = 'inline-block';
            if (exportConfigBtn) exportConfigBtn.style.display = 'inline-block';
            
            // 允许标题编辑
            if (pageTitle) pageTitle.setAttribute('contenteditable', 'true');
            sectionTitles.forEach(title => title.setAttribute('contenteditable', 'true'));
            
            // 添加编辑模式类名
            if (headerControls) headerControls.classList.add('editing');
            sectionHeaders.forEach(header => header.classList.add('edit-mode'));
            
            // 为所有分组标题添加点击事件（用于编辑分组样式）
            setTimeout(() => {
                document.querySelectorAll('.section-title').forEach(title => {
                    title.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (window.isEditMode) {
                            const section = this.closest('.links-section');
                            const sectionId = section.dataset.sectionId;
                            const sectionData = window.sectionsData.find(s => s.id === sectionId);
                            
                            if (sectionData && typeof UI !== 'undefined' && typeof UI.showSectionEditModal === 'function') {
                                UI.showSectionEditModal(sectionData);
                            }
                        }
                    });
                });
            }, 100);
            
            // 添加编辑覆盖层
            setTimeout(() => {
                if (typeof UI !== 'undefined' && typeof UI.addEditOverlays === 'function') {
                    UI.addEditOverlays();
                }
                if (typeof Links !== 'undefined' && typeof Links.bindEditDeleteEvents === 'function') {
                    Links.bindEditDeleteEvents();
                }
            }, 50);
            
            // 初始化拖拽功能
            setTimeout(() => {
                if (typeof DragDrop !== 'undefined' && typeof DragDrop.initDragAndDrop === 'function') {
                    DragDrop.initDragAndDrop();
                }
            }, 100);
        } else {
            // 隐藏编辑模式按钮
            if (addSectionBtn) addSectionBtn.style.display = 'none';
            if (importConfigBtn) importConfigBtn.style.display = 'none';
            if (exportConfigBtn) exportConfigBtn.style.display = 'none';
            
            // 禁止标题编辑
            if (pageTitle) pageTitle.setAttribute('contenteditable', 'false');
            sectionTitles.forEach(title => title.setAttribute('contenteditable', 'false'));
            
            // 移除编辑模式类名
            if (headerControls) headerControls.classList.remove('editing');
            sectionHeaders.forEach(header => header.classList.remove('edit-mode'));
            
            // 移除编辑覆盖层
            if (typeof UI !== 'undefined' && typeof UI.removeEditOverlays === 'function') {
                UI.removeEditOverlays();
            }
            
            // 清理拖拽功能
            if (typeof DragDrop !== 'undefined' && typeof DragDrop.cleanupDragAndDrop === 'function') {
                DragDrop.cleanupDragAndDrop();
            }
        }
    },
    
    // 渲染特定分组的链接
    renderLinksForSection(sectionId, links) {
        const linksContainer = document.getElementById(`linksContainer-${sectionId}`);
        if (!linksContainer) return;
        
        linksContainer.innerHTML = '';
        
        links.forEach(link => {
            const linkItem = document.createElement('div');
            linkItem.className = 'link-item';
            if (window.isEditMode) {
                linkItem.classList.add('edit-mode');
            }
            linkItem.dataset.linkId = link.id;
            
            // 使用网站图标或默认emoji
            const faviconUrl = Utils.getFaviconUrl(link.url);
            
            linkItem.innerHTML = `
                <a href="${link.url}" class="link-button" target="_blank">
                    <div class="link-icon" data-favicon-url="${faviconUrl || ''}">
                        ${link.icon || '❓'}
                    </div>
                    <div class="link-name">${link.name}</div>
                </a>
            `;
            
            linksContainer.appendChild(linkItem);
            
            // 如果有favicon URL，尝试加载它
            if (faviconUrl) {
                Utils.loadFavicon(linkItem, faviconUrl, link.icon || '❓');
            }
        });
        
        // 如果在编辑模式下，添加"添加链接"的占位符按钮
        if (window.isEditMode) {
            const addLinkPlaceholder = document.createElement('div');
            addLinkPlaceholder.className = 'link-item';
            addLinkPlaceholder.innerHTML = `
                <div class="add-link-placeholder" data-section-id="${sectionId}">
                    <div class="link-icon">+</div>
                    <div class="link-name">添加链接</div>
                </div>
            `;
            linksContainer.appendChild(addLinkPlaceholder);
            
            // 绑定点击事件
            const placeholder = addLinkPlaceholder.querySelector('.add-link-placeholder');
            if (placeholder) {
                placeholder.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (typeof UI !== 'undefined' && typeof UI.showLinkEditModal === 'function') {
                        UI.showLinkEditModal(null);
                        const modal = document.getElementById('linkEditModal');
                        if (modal) {
                            modal.dataset.currentSectionId = sectionId;
                        }
                    }
                });
            }
        }
        
        // 如果在编辑模式下，添加编辑覆盖层
        if (window.isEditMode) {
            // 为真实链接项添加编辑覆盖层（排除添加链接按钮）
            setTimeout(() => {
                document.querySelectorAll(`#linksContainer-${sectionId} .link-item`).forEach(item => {
                    // 检查是否是添加链接按钮，如果是则跳过
                    if (!item.querySelector('.add-link-placeholder')) {
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
                    }
                });
                
                // 重新绑定编辑和删除事件
                setTimeout(() => {
                    if (typeof Links !== 'undefined' && typeof Links.bindEditDeleteEvents === 'function') {
                        Links.bindEditDeleteEvents();
                    }
                }, 10);
            }, 50);
        }
    },
    
    // 局部更新特定分组
    updateSection(sectionId) {
        const section = window.sectionsData.find(s => s.id === sectionId);
        if (!section) return;
        
        const sectionElement = document.querySelector(`.links-section[data-section-id="${sectionId}"]`);
        if (!sectionElement) {
            // 如果分组元素不存在，重新渲染所有分组
            this.renderSections();
            return;
        }
        
        // 更新分组标题
        const titleElement = sectionElement.querySelector('.section-title');
        if (titleElement) {
            titleElement.textContent = section.title;
        }
        
        // 更新分组背景色
        sectionElement.style.backgroundColor = section.backgroundColor;
        
        // 重新渲染该分组的链接
        this.renderLinksForSection(sectionId, section.links);
        
        // 更新链接按钮样式
        let buttonColor = section.linkButtonColor || Utils.lightenColor(section.backgroundColor, 20);
        // 保存计算出的颜色
        const sectionIndex = window.sectionsData.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1 && !section.linkButtonColor) {
            window.sectionsData[sectionIndex].linkButtonColor = buttonColor;
        }
        if (typeof Styles !== 'undefined' && typeof Styles.updateSectionLinkButtonStyle === 'function') {
            Styles.updateSectionLinkButtonStyle(sectionId, buttonColor);
        }
        
        // 如果在编辑模式下，重新绑定事件
        if (window.isEditMode) {
            setTimeout(() => {
                if (typeof Links !== 'undefined' && typeof Links.bindEditDeleteEvents === 'function') {
                    Links.bindEditDeleteEvents();
                }
                // 重新绑定分组标题点击事件
                const titleElement = sectionElement.querySelector('.section-title');
                if (titleElement) {
                    titleElement.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (window.isEditMode) {
                            const sectionData = window.sectionsData.find(s => s.id === sectionId);
                            if (sectionData && typeof UI !== 'undefined' && typeof UI.showSectionEditModal === 'function') {
                                UI.showSectionEditModal(sectionData);
                            }
                        }
                    });
                }
            }, 10);
        }
    },
    
    // 局部添加分组
    addSectionElement(section) {
        const sectionsContainer = document.getElementById('sectionsContainer');
        const sectionElement = document.createElement('div');
        sectionElement.className = 'links-section';
        sectionElement.dataset.sectionId = section.id;
        sectionElement.style.backgroundColor = section.backgroundColor;
        sectionElement.setAttribute('draggable', window.isEditMode);
        
        sectionElement.innerHTML = `
            <div class="section-header ${window.isEditMode ? 'drag-handle' : ''}">
                <h2 class="section-title" contenteditable="false">${section.title}</h2>
            </div>
            <div class="links-grid" id="linksContainer-${section.id}">
                <!-- 链接按钮将通过JavaScript渲染 -->
            </div>
        `;
        
        sectionsContainer.appendChild(sectionElement);
        
        // 渲染该分组的链接
        this.renderLinksForSection(section.id, section.links);
        
        // 应用链接按钮颜色
        let buttonColor = section.linkButtonColor || Utils.lightenColor(section.backgroundColor, 20);
        // 保存计算出的颜色
        const sectionIndex = window.sectionsData.findIndex(s => s.id === section.id);
        if (sectionIndex !== -1 && !section.linkButtonColor) {
            window.sectionsData[sectionIndex].linkButtonColor = buttonColor;
        }
        if (typeof Styles !== 'undefined' && typeof Styles.updateSectionLinkButtonStyle === 'function') {
            Styles.updateSectionLinkButtonStyle(section.id, buttonColor);
        }
        
        // 如果在编辑模式下，绑定事件
        if (window.isEditMode) {
            setTimeout(() => {
                if (typeof Links !== 'undefined' && typeof Links.bindEditDeleteEvents === 'function') {
                    Links.bindEditDeleteEvents();
                }
                if (typeof DragDrop !== 'undefined' && typeof DragDrop.initDragAndDrop === 'function') {
                    DragDrop.initDragAndDrop();
                }
                
                // 绑定分组标题点击事件
                const titleElement = sectionElement.querySelector('.section-title');
                if (titleElement) {
                    titleElement.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (window.isEditMode) {
                            if (typeof UI !== 'undefined' && typeof UI.showSectionEditModal === 'function') {
                                UI.showSectionEditModal(section);
                            }
                        }
                    });
                }
            }, 10);
        }
    },
    
    // 局部删除分组
    removeSectionElement(sectionId) {
        const sectionElement = document.querySelector(`.links-section[data-section-id="${sectionId}"]`);
        if (sectionElement) {
            sectionElement.remove();
        }
    }
};