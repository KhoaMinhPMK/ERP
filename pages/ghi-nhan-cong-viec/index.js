document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.currentPage = 'timesheet';

    if (window.ERPApp) {
        window.ERPApp.currentPage = 'timesheet';
    }
});
