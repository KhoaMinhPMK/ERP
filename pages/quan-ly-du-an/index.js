document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.currentPage = 'projects';

    if (window.ERPApp) {
        window.ERPApp.currentPage = 'projects';
    }
});
