document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.currentPage = 'login';

    if (window.ERPApp) {
        window.ERPApp.currentPage = 'login';
    }
});