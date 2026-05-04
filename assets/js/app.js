/**
 * Vận Hành ERP - Main Application JavaScript
 * Core functionality and utilities
 */

const ERPApp = {
    // Configuration
    config: {
        apiBaseUrl: '/api',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        currency: '₫',
        storageKeys: {
            user: 'erp_user',
            sidebarCollapsed: 'erp_sidebar_collapsed'
        },
        routes: {
            login: 'pages/dang-nhap/index.html',
            dashboard: 'index.html',
            hr: 'pages/quan-ly-nhan-su/index.html',
            projects: 'pages/quan-ly-du-an/index.html',
            approval: 'pages/trung-tam-phe-duyet/index.html',
            timesheet: 'pages/ghi-nhan-cong-viec/index.html',
            finance: 'pages/tai-chinh/index.html',
            reports: 'pages/bao-cao/index.html',
            settings: 'pages/cai-dat/index.html'
        },
        navigation: {
            'Tổng quan': 'dashboard',
            'Nhân sự': 'hr',
            'Dự án': 'projects',
            'Phê duyệt': 'approval',
            'Timesheet': 'timesheet',
            'Tài chính': 'finance',
            'Báo cáo': 'reports',
            'Cài đặt': 'settings'
        },
        demoUser: {
            name: 'Nguyễn Văn A',
            role: 'Giám đốc vận hành',
            email: 'ops.director@vanhanherp.vn',
            initials: 'NA'
        }
    },

    // Initialize application
    init() {
        this.currentPage = document.body?.dataset.page || 'dashboard';

        if (!this.enforceAuth()) {
            return;
        }

        this.setupEventListeners();
        this.setupNavigation();
        this.setupAuthActions();
        this.loadUserData();
        this.initializeComponents();
        this.setupDemoActions();
    },

    enforceAuth() {
        const userData = this.getStoredUserData();

        if (this.currentPage === 'login') {
            if (userData) {
                this.navigateTo(this.resolveRoute('dashboard'));
                return false;
            }

            return true;
        }

        if (!userData) {
            this.navigateTo(this.resolveRoute('login'));
            return false;
        }

        return true;
    },

    getRoutePrefix() {
        const pathname = window.location.pathname.replace(/\\/g, '/');

        if (pathname.includes('/pages/')) {
            return '../../';
        }

        if (pathname.includes('/pages/dang-nhap/')) {
            return '../../';
        }

        return '';
    },

    resolveRoute(routeName) {
        const route = this.config.routes[routeName] || this.config.routes.dashboard;
        return `${this.getRoutePrefix()}${route}`;
    },

    // Setup global event listeners
    setupEventListeners() {
        this.handleSidebarToggle();
        this.handleDropdowns();
        this.handleModals();
    },

    setupNavigation() {
        const navigationLinks = document.querySelectorAll('.sidebar-link');

        navigationLinks.forEach((link) => {
            const label = link.querySelector('span:last-child')?.textContent?.trim();
            const routeName = this.config.navigation[label];

            if (!routeName) {
                return;
            }

            link.href = this.resolveRoute(routeName);
            link.classList.toggle('active', routeName === this.currentPage);
        });
    },

    // Sidebar toggle for mobile
    handleSidebarToggle() {
        const sidebar = document.querySelector('.sidebar');
        const pageHeader = document.querySelector('.page-header');
        const sidebarHeader = document.querySelector('.sidebar-header');
        const sidebarNav = document.querySelector('.sidebar-nav');

        if (!sidebar) {
            return;
        }

        const pageHeaderHeading = pageHeader?.firstElementChild;
        const pageHeaderActions = pageHeader?.lastElementChild;
        const sidebarBrand = sidebarHeader?.firstElementChild;
        const isDesktop = () => window.innerWidth > 1024;

        if (pageHeaderHeading) {
            pageHeaderHeading.classList.add('page-header-heading');
        }

        if (pageHeaderActions && pageHeaderActions !== pageHeaderHeading) {
            pageHeaderActions.classList.add('page-header-actions');
        }

        if (sidebarHeader) {
            sidebarHeader.classList.add('sidebar-header-frame');
        }

        if (sidebarBrand) {
            sidebarBrand.classList.add('sidebar-brand');
            const brandCopy = sidebarBrand.lastElementChild;
            if (brandCopy) {
                brandCopy.classList.add('sidebar-brand-copy');
            }
        }

        let toggleBtn = document.querySelector('[data-sidebar-toggle]');
        if (!toggleBtn && pageHeaderHeading) {
            toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'btn-secondary mobile-nav-toggle';
            toggleBtn.setAttribute('data-sidebar-toggle', '');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-label', 'Mở menu điều hướng');
            toggleBtn.innerHTML = `
                <span class="material-symbols-outlined">menu</span>
                <span>Menu</span>
            `;
            pageHeaderHeading.prepend(toggleBtn);
        }

        let collapseBtn = document.querySelector('[data-sidebar-collapse]');
        if (!collapseBtn && (sidebarNav || sidebarHeader)) {
            collapseBtn = document.createElement('button');
            collapseBtn.type = 'button';
            collapseBtn.className = 'btn-ghost sidebar-collapse-toggle';
            collapseBtn.setAttribute('data-sidebar-collapse', '');
            collapseBtn.setAttribute('aria-expanded', 'true');
            collapseBtn.setAttribute('aria-label', 'Thu gọn thanh điều hướng');
            collapseBtn.innerHTML = `
                <span class="material-symbols-outlined">left_panel_close</span>
                <span class="sidebar-collapse-label">Thu gọn</span>
            `;
            if (sidebarNav?.parentNode) {
                sidebarNav.insertAdjacentElement('afterend', collapseBtn);
            } else {
                sidebarHeader?.appendChild(collapseBtn);
            }
        }

        let overlay = document.querySelector('[data-sidebar-overlay]');
        if (!overlay) {
            overlay = document.createElement('button');
            overlay.type = 'button';
            overlay.className = 'sidebar-overlay';
            overlay.setAttribute('data-sidebar-overlay', '');
            overlay.setAttribute('aria-label', 'Đóng menu điều hướng');
            document.body.appendChild(overlay);
        }

        const setDesktopCollapsed = (collapsed) => {
            document.body.classList.toggle('sidebar-collapsed', collapsed);
            localStorage.setItem(this.config.storageKeys.sidebarCollapsed, collapsed ? '1' : '0');

            if (collapseBtn) {
                collapseBtn.setAttribute('aria-expanded', String(!collapsed));
                collapseBtn.setAttribute(
                    'aria-label',
                    collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'
                );
                const icon = collapseBtn.querySelector('.material-symbols-outlined');
                const label = collapseBtn.querySelector('.sidebar-collapse-label');
                if (icon) {
                    icon.textContent = collapsed ? 'left_panel_open' : 'left_panel_close';
                }
                if (label) {
                    label.textContent = collapsed ? 'Mở rộng' : 'Thu gọn';
                }
            }
        };

        if (isDesktop()) {
            setDesktopCollapsed(localStorage.getItem(this.config.storageKeys.sidebarCollapsed) === '1');
        }

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        };

        const toggleSidebar = () => {
            if (isDesktop()) {
                setDesktopCollapsed(!document.body.classList.contains('sidebar-collapsed'));
                return;
            }

            const willOpen = !sidebar.classList.contains('active');
            sidebar.classList.toggle('active', willOpen);
            document.body.classList.toggle('sidebar-open', willOpen);
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', String(willOpen));
            }
        };

        toggleBtn?.addEventListener('click', toggleSidebar);
        collapseBtn?.addEventListener('click', () => {
            setDesktopCollapsed(!document.body.classList.contains('sidebar-collapsed'));
        });
        overlay.addEventListener('click', closeSidebar);

        document.querySelectorAll('.sidebar-link').forEach((link) => {
            link.addEventListener('click', closeSidebar);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeSidebar();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                closeSidebar();
                setDesktopCollapsed(localStorage.getItem(this.config.storageKeys.sidebarCollapsed) === '1');
            } else {
                document.body.classList.remove('sidebar-collapsed');
            }
        });
    },

    setupAuthActions() {
        const profilePanel = document.querySelector('[data-sidebar-profile]') || document.querySelector('.page-inline-711681ecfb');
        if (profilePanel) {
            profilePanel.classList.add('sidebar-profile');

            const summary = profilePanel.firstElementChild;
            if (summary) {
                summary.classList.add('sidebar-profile-summary');

                const avatar = summary.children[0];
                const meta = summary.children[1];

                if (avatar) {
                    avatar.classList.add('sidebar-profile-avatar');
                    avatar.setAttribute('data-user-avatar', '');
                }

                if (meta) {
                    meta.classList.add('sidebar-profile-meta');
                    meta.children[0]?.setAttribute('data-user-name', '');
                    meta.children[1]?.setAttribute('data-user-role', '');
                }
            }

            let actions = profilePanel.querySelector('.sidebar-profile-actions');
            if (!actions) {
                actions = document.createElement('div');
                actions.className = 'sidebar-profile-actions';
                actions.innerHTML = `
                    <button type="button" class="btn-ghost sidebar-logout-btn" data-logout>
                        <span class="material-symbols-outlined">logout</span>
                        <span class="sidebar-profile-action-label">Đăng xuất</span>
                    </button>
                `;
                profilePanel.appendChild(actions);
            }
        }

        document.querySelectorAll('[data-logout]').forEach((button) => {
            button.addEventListener('click', () => this.logout());
        });

        const loginForm = document.querySelector('[data-login-form]');
        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const formData = new FormData(loginForm);
                const fullName = String(formData.get('fullName') || '').trim();
                const role = String(formData.get('role') || '').trim();
                const email = String(formData.get('email') || '').trim();

                const user = {
                    ...this.config.demoUser,
                    name: fullName || this.config.demoUser.name,
                    role: role || this.config.demoUser.role,
                    email: email || this.config.demoUser.email,
                    initials: this.buildInitials(fullName || this.config.demoUser.name)
                };

                localStorage.setItem(this.config.storageKeys.user, JSON.stringify(user));
                this.navigateTo(this.resolveRoute('dashboard'));
            });
        }
    },

    buildInitials(name) {
        return String(name)
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('');
    },

    logout() {
        localStorage.removeItem(this.config.storageKeys.user);
        localStorage.removeItem(this.config.storageKeys.sidebarCollapsed);
        this.navigateTo(this.resolveRoute('login'));
    },

    // Dropdown menus
    handleDropdowns() {
        const dropdowns = document.querySelectorAll('[data-dropdown]');

        const closeAllDropdowns = (exceptMenu = null) => {
            dropdowns.forEach((dropdown) => {
                const trigger = dropdown.querySelector('[data-dropdown-trigger]');
                const menu = dropdown.querySelector('[data-dropdown-menu]');
                if (!menu || menu === exceptMenu) {
                    return;
                }

                menu.classList.remove('active');
                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        };

        dropdowns.forEach((dropdown) => {
            const trigger = dropdown.querySelector('[data-dropdown-trigger]');
            const menu = dropdown.querySelector('[data-dropdown-menu]');

            if (trigger && menu) {
                if (!trigger.hasAttribute('aria-expanded')) {
                    trigger.setAttribute('aria-expanded', 'false');
                }

                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const willOpen = !menu.classList.contains('active');
                    closeAllDropdowns();
                    if (willOpen) {
                        menu.classList.add('active');
                        trigger.setAttribute('aria-expanded', 'true');
                    } else {
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                });

                menu.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
            }
        });

        document.addEventListener('click', () => closeAllDropdowns());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllDropdowns();
            }
        });
    },

    // Modal dialogs
    handleModals() {
        const modalTriggers = document.querySelectorAll('[data-modal-trigger]');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.dataset.modalTrigger;
                this.openModal(modalId);
            });
        });

        const modalCloses = document.querySelectorAll('[data-modal-close]');
        modalCloses.forEach(close => {
            close.addEventListener('click', () => {
                this.closeModal(close.closest('.modal'));
            });
        });
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    setupDemoActions() {
        document.addEventListener('click', (event) => {
            const btn = event.target.closest('button');
            if (!btn || btn.disabled) {
                return;
            }

            const main = btn.closest('.main-content');
            if (!main) {
                return;
            }

            if (
                btn.matches(
                    '[data-logout], [data-dropdown-trigger], [data-modal-trigger], [data-modal-close], [data-sidebar-toggle]'
                )
            ) {
                return;
            }
            if (btn.getAttribute('onclick')) {
                return;
            }

            const title = (btn.getAttribute('title') || '').trim();
            const icon =
                btn.querySelector(':scope > .material-symbols-outlined')?.textContent?.trim() ||
                btn.querySelector('.material-symbols-outlined')?.textContent?.trim() ||
                '';
            let label = btn.textContent.replace(/\s+/g, ' ').trim();
            if (!label && icon) {
                label = icon;
            }

            const pager = btn.closest('.page-inline-d2f87c7fad');
            if (pager) {
                this.handleDemoPaginationClick(btn, pager);
                return;
            }

            const tabRow = btn.closest('.page-inline-078223772a');
            if (tabRow && btn.classList.contains('page-inline-a59a7be0e3')) {
                this.handleDemoApprovalTabClick(btn, tabRow);
                return;
            }

            const weekSel = btn.closest('.week-selector');
            if (weekSel) {
                this.handleDemoWeekSelectorClick(btn, weekSel, icon, label);
                return;
            }

            if (title && this.handleDemoTitleAction(btn, title)) {
                return;
            }

            if (this.handleDemoLabelAction(btn, label, icon)) {
                return;
            }

            this.showNotification(`Đã thực hiện: ${label || title || 'Thao tác'} (chế độ demo)`, 'info');
        });
    },

    handleDemoPaginationClick(btn, pager) {
        const icon = btn.querySelector('.material-symbols-outlined')?.textContent?.trim();
        const textNum = btn.textContent.replace(/\s+/g, '').trim();
        let page = parseInt(pager.dataset.demoPage || '1', 10);
        const maxPage = 12;

        if (icon === 'chevron_left') {
            if (btn.disabled) {
                return;
            }
            page = Math.max(1, page - 1);
        } else if (icon === 'chevron_right') {
            if (btn.disabled) {
                return;
            }
            page = Math.min(maxPage, page + 1);
        } else if (/^\d+$/.test(textNum)) {
            page = parseInt(textNum, 10);
        } else {
            return;
        }

        pager.dataset.demoPage = String(page);

        const buttons = [...pager.querySelectorAll('button')];
        let prevBtn;
        let nextBtn;
        buttons.forEach((b) => {
            const ic = b.querySelector('.material-symbols-outlined')?.textContent?.trim();
            if (ic === 'chevron_left') {
                prevBtn = b;
            } else if (ic === 'chevron_right') {
                nextBtn = b;
            }
        });
        if (prevBtn) {
            prevBtn.disabled = page <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = page >= maxPage;
        }

        buttons.forEach((b) => {
            const t = b.textContent.replace(/\s+/g, '').trim();
            if (/^\d+$/.test(t)) {
                const n = parseInt(t, 10);
                const active = n === page;
                b.classList.toggle('btn-primary', active);
                b.classList.toggle('btn-secondary', !active);
            }
        });

        this.showNotification(`Đã chuyển sang trang ${page} (demo).`, 'info');
    },

    handleDemoApprovalTabClick(btn, tabRow) {
        tabRow.querySelectorAll('button').forEach((b) => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-ghost');
        });
        btn.classList.remove('btn-ghost');
        btn.classList.add('btn-primary');

        const filterLabel = btn.textContent.replace(/\s+/g, ' ').trim();
        const table = document.querySelector('main.main-content [data-table]');
        if (table) {
            if (filterLabel === 'Tất cả') {
                this.filterTable(table, '');
            } else {
                this.filterTable(table, filterLabel);
            }
        }

        this.showNotification(`Đang hiển thị nhóm: ${filterLabel}`, 'success');
    },

    handleDemoWeekSelectorClick(btn, weekSel, icon, label) {
        const heading = weekSel.querySelector('h2, h3');
        const sub = weekSel.querySelector('p.body-sm');

        if (label.includes('Hôm nay') || icon === 'today') {
            if (heading) {
                heading.textContent = 'Tuần 18/2024';
            }
            if (sub) {
                sub.textContent = '29/04/2024 - 05/05/2024';
            }
            this.showNotification('Đã nhảy về tuần hiện tại (demo).', 'success');
            return;
        }

        const match = heading?.textContent?.match(/Tuần\s+(\d+)\s*\/\s*(\d+)/);
        if (match && heading) {
            let week = parseInt(match[1], 10);
            const year = parseInt(match[2], 10);
            if (icon === 'chevron_left') {
                week = Math.max(1, week - 1);
            } else if (icon === 'chevron_right') {
                week = Math.min(53, week + 1);
            }
            heading.textContent = `Tuần ${week}/${year}`;
        }

        this.showNotification('Đã đổi tuần xem timesheet (demo).', 'info');
    },

    handleDemoTitleAction(btn, title) {
        const row = btn.closest('tbody tr');
        if (!row) {
            return false;
        }

        const disableRowActions = () => {
            row.querySelectorAll('button').forEach((b) => {
                b.disabled = true;
            });
        };

        if (title === 'Phê duyệt') {
            const badge = row.querySelector('.badge');
            if (badge) {
                badge.className = 'badge badge-success';
                badge.textContent = 'Đã duyệt';
            }
            disableRowActions();
            this.showNotification('Đã phê duyệt yêu cầu (demo).', 'success');
            return true;
        }

        if (title === 'Từ chối') {
            const badge = row.querySelector('.badge');
            if (badge) {
                badge.className = 'badge badge-error';
                badge.textContent = 'Đã từ chối';
            }
            disableRowActions();
            this.showNotification('Đã từ chối yêu cầu (demo).', 'success');
            return true;
        }

        if (title === 'Xem chi tiết') {
            const cells = [...row.querySelectorAll('td')]
                .map((td) => td.innerText.replace(/\s+/g, ' ').trim())
                .filter(Boolean);
            const preview = cells.slice(0, 5).join(' · ');
            this.showNotification(preview ? `Chi tiết: ${preview}` : 'Đang mở chi tiết (demo).', 'info');
            return true;
        }

        if (title === 'Sửa') {
            const nameCell = row.querySelector('td:nth-child(3)') || row.querySelector('td:nth-child(2)');
            const name = nameCell?.innerText.trim().split('\n')[0] || 'mục';
            this.showNotification(`Mở form chỉnh sửa: ${name} (demo).`, 'info');
            return true;
        }

        return false;
    },

    handleDemoLabelAction(btn, label, icon) {
        const lower = label.toLowerCase();

        if (lower.includes('làm mới') || icon === 'refresh') {
            this.showNotification('Đã làm mới dữ liệu hiển thị (demo).', 'success');
            return true;
        }

        if (lower.includes('xuất excel') || (lower.includes('xuất') && lower.includes('excel'))) {
            this.showNotification('Đang xuất file Excel… (demo)', 'success');
            return true;
        }

        if (lower.includes('xuất báo cáo') || (lower.includes('báo cáo') && icon === 'download')) {
            this.showNotification('Đang xuất báo cáo… (demo)', 'success');
            return true;
        }

        if (lower.includes('bộ lọc') || lower.includes('lọc') || icon === 'filter_list') {
            this.showNotification('Đã mở bộ lọc nâng cao (demo).', 'info');
            return true;
        }

        if (lower.includes('thêm nhân viên')) {
            this.showNotification('Mở form thêm nhân viên mới (demo).', 'info');
            return true;
        }

        if (lower.includes('tạo dự án')) {
            this.showNotification('Mở form tạo dự án mới (demo).', 'info');
            return true;
        }

        if (lower.includes('in báo cáo') || icon === 'print') {
            window.print();
            return true;
        }

        if (lower.includes('gửi duyệt') || lower.includes('gửi phê duyệt')) {
            this.showNotification('Đã gửi phiếu để phê duyệt (demo).', 'success');
            return true;
        }

        if (lower.includes('lưu nháp') || icon === 'save') {
            this.showNotification('Đã lưu nháp timesheet (demo).', 'success');
            return true;
        }

        if (lower.includes('thêm dòng')) {
            this.demoAppendTimesheetRow(btn);
            return true;
        }

        if (lower.includes('sao chép tuần trước')) {
            this.showNotification('Đã sao chép giờ từ tuần trước (demo).', 'success');
            return true;
        }

        if (icon === 'mail' || lower === 'mail') {
            this.showNotification('Đã mở email chúc mừng (demo).', 'info');
            return true;
        }

        if (lower.includes('xem lịch')) {
            this.showNotification('Đang mở lịch đầy đủ (demo).', 'info');
            return true;
        }

        return false;
    },

    demoAppendTimesheetRow(btn) {
        const table = btn.closest('.main-content')?.querySelector('table.timesheet-table');
        const tbody = table?.querySelector('tbody');
        if (!tbody) {
            this.showNotification('Không tìm thấy bảng timesheet.', 'error');
            return;
        }

        const totalRow = tbody.querySelector('tr.total-row');
        const proto = tbody.querySelector('tr:not(.total-row)');
        if (!proto || !totalRow) {
            this.showNotification('Đã ghi nhận thêm dòng (demo).', 'info');
            return;
        }

        const tr = proto.cloneNode(true);
        tr.querySelectorAll('.hours-cell').forEach((cell) => {
            cell.textContent = '0.0';
        });
        const totalCell = tr.querySelector('.total-cell');
        if (totalCell) {
            totalCell.textContent = '0.0';
        }
        if (tr.cells[0]) {
            tr.cells[0].textContent = 'Nhân viên (dòng mới)';
        }
        const badge = tr.querySelector('.badge');
        if (badge) {
            badge.className = 'badge badge-neutral';
            badge.textContent = 'Nháp';
        }

        tbody.insertBefore(tr, totalRow);
        this.showNotification('Đã thêm một dòng nhập giờ (demo).', 'success');
    },

    // Load user data
    loadUserData() {
        const userData = this.getStoredUserData() || this.config.demoUser;
        if (userData) {
            this.updateUserUI(userData);
        }
    },

    getStoredUserData() {
        const stored = localStorage.getItem(this.config.storageKeys.user);
        return stored ? JSON.parse(stored) : null;
    },

    updateUserUI(userData) {
        const userNameEl = document.querySelector('[data-user-name]');
        const userRoleEl = document.querySelector('[data-user-role]');
        const userAvatarEl = document.querySelector('[data-user-avatar]');
        const userInitialsEl = document.querySelector('[data-user-initials]');

        if (userNameEl) userNameEl.textContent = userData.name;
        if (userRoleEl) userRoleEl.textContent = userData.role || 'Người dùng hệ thống';
        if (userAvatarEl) {
            if (userAvatarEl.tagName === 'IMG' && userData.avatar) {
                userAvatarEl.src = userData.avatar;
            } else {
                userAvatarEl.textContent = userData.initials || this.buildInitials(userData.name);
            }
        }
        if (userInitialsEl) {
            userInitialsEl.textContent = userData.initials || this.buildInitials(userData.name);
        }
    },

    // Initialize components
    initializeComponents() {
        this.initTables();
        this.initForms();
        this.initCharts();
    },

    // Table functionality
    initTables() {
        const tables = document.querySelectorAll('[data-table]');

        tables.forEach(table => {
            this.setupTableSort(table);
            this.setupTableFilter(table);
        });
    },

    setupTableSort(table) {
        const headers = table.querySelectorAll('th[data-sortable]');

        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const column = header.dataset.sortable;
                this.sortTable(table, column);
            });
        });
    },

    sortTable(table, column) {
        console.log('Sorting table by:', column);
    },

    setupTableFilter(table) {
        let filterInput = table.parentElement?.querySelector('[data-table-filter]');
        if (!filterInput) {
            filterInput = table.closest('.table-container')?.querySelector('[data-table-filter]');
        }

        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                this.filterTable(table, e.target.value);
            });
        }
    },

    filterTable(table, query) {
        const rows = table.querySelectorAll('tbody tr');
        const searchTerm = query.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    },

    // Form handling
    initForms() {
        const forms = document.querySelectorAll('[data-form]');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    },

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Form submitted:', data);
        this.showNotification('Đã lưu thành công', 'success');
    },

    // Chart initialization
    initCharts() {
        console.log('Charts initialized');
    },

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Utility functions
    formatDate(date, format = this.config.dateFormat) {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },

    formatCurrency(amount) {
        if (!amount && amount !== 0) return '';
        return new Intl.NumberFormat('vi-VN').format(amount) + ' ' + this.config.currency;
    },

    formatNumber(number) {
        if (!number && number !== 0) return '';
        return new Intl.NumberFormat('vi-VN').format(number);
    },

    // API calls
    async apiCall(endpoint, options = {}) {
        const url = this.config.apiBaseUrl + endpoint;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            this.showNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
            throw error;
        }
    },

    // Navigation
    navigateTo(path) {
        window.location.href = path;
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ERPApp.init());
} else {
    ERPApp.init();
}

// Export for use in other modules
window.ERPApp = ERPApp;
