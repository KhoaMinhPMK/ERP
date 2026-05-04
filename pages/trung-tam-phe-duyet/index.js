document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.currentPage = 'approval';

    if (window.ERPApp) {
        window.ERPApp.currentPage = 'approval';
    }
});
