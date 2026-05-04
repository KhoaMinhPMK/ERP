document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.currentPage = 'dashboard';

    if (window.ERPApp) {
        window.ERPApp.currentPage = 'dashboard';
    }
});
