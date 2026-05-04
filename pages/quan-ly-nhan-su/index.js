document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.currentPage = 'hr';

    if (window.ERPApp) {
        window.ERPApp.currentPage = 'hr';
    }
});
