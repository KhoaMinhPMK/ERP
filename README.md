# Vận Hành ERP - Demo Application

Hệ thống ERP demo được xây dựng theo tiêu chuẩn thiết kế Modern Corporate cho doanh nghiệp Việt Nam.

## 📁 Cấu trúc thư mục

```
erp-demo/
├── assets/
│   ├── css/
│   │   └── design-system.css    # Design system chính
│   ├── js/
│   │   └── app.js                # JavaScript core
│   └── images/                   # Hình ảnh, logo
├── components/
│   ├── sidebar.html              # Sidebar navigation
│   ├── header.html               # Page header
│   ├── data-table.html           # Data table component
│   └── kpi-card.html             # KPI card component
├── pages/
│   ├── index.html                # Tổng quan vận hành
│   ├── quan-ly-nhan-su.html     # Quản lý nhân sự
│   ├── quan-ly-du-an.html       # Quản lý dự án
│   ├── trung-tam-phe-duyet.html # Trung tâm phê duyệt
│   └── ghi-nhan-cong-viec.html  # Timesheet
└── data/                         # Mock data (JSON)
```

## 🎨 Design System

### Colors
- **Primary**: `#000000` (Black) - Chủ đạo
- **Secondary**: `#006a61` (Teal) - Accent cho actions
- **Background**: `#fcf8fa` - Nền chính
- **Surface**: `#ffffff` - Cards, panels

### Typography
- **Font Family**: Inter
- **Base Size**: 14px
- **Heading 1**: 24px, 600 weight
- **Heading 2**: 20px, 600 weight
- **Body**: 14px, 400 weight
- **Table Data**: 13px, 400 weight

### Spacing
- **Base Unit**: 4px
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64px
- **Container Padding**: 24px
- **Gutter**: 16px

### Border Radius
- **Default**: 0.25rem (4px)
- **Large**: 0.5rem (8px)
- **Full**: 9999px (rounded)

## 🚀 Cách sử dụng

### 1. Mở trực tiếp trong trình duyệt

```bash
# Mở file index.html trong thư mục pages
open pages/index.html
```

### 2. Sử dụng Live Server (khuyến nghị)

```bash
# Cài đặt live-server (nếu chưa có)
npm install -g live-server

# Chạy từ thư mục gốc
cd erp-demo
live-server pages/
```

### 3. Sử dụng Python HTTP Server

```bash
cd erp-demo
python -m http.server 8000
# Truy cập: http://localhost:8000/pages/
```

## 📄 Các màn hình đã triển khai

### 1. Tổng quan vận hành (`index.html`)
- KPI cards: Tổng nhân viên, Dự án đang chạy, Chờ phê duyệt, Tổng giờ làm
- Bảng yêu cầu chờ phê duyệt
- Thống kê chấm công hôm nay
- Cảnh báo và thông báo
- Sinh nhật & kỷ niệm

### 2. Quản lý nhân sự (`quan-ly-nhan-su.html`)
- KPI cards: Tổng nhân viên, Đang làm việc, Đang nghỉ phép, Nhân viên mới
- Danh sách nhân viên với avatar
- Tìm kiếm và lọc
- Thao tác: Xem, Sửa

### 3. Quản lý dự án (`quan-ly-du-an.html`)
- KPI cards: Tổng dự án, Đang thực hiện, Có rủi ro, Hoàn thành
- Danh sách dự án với progress bar
- Hiển thị ngân sách, deadline, mức độ ưu tiên
- Trạng thái dự án

### 4. Trung tâm phê duyệt (`trung-tam-phe-duyet.html`)
- KPI cards: Chờ phê duyệt, Đã duyệt, Từ chối, Thời gian TB
- Danh sách yêu cầu phê duyệt
- Tabs lọc theo loại: Tất cả, Nghỉ phép, Tạm ứng, Hợp đồng
- Actions: Phê duyệt, Từ chối, Xem chi tiết

### 5. Ghi nhận công việc (`ghi-nhan-cong-viec.html`)
- Week selector với navigation
- Summary cards: Tổng giờ tuần, TB/người, Đã gửi, Chưa gửi
- Bảng timesheet theo tuần (T2-T6)
- Sticky columns và headers
- Trạng thái: Đã duyệt, Chờ duyệt, Nháp

## 🎯 Tính năng chính

### Components tái sử dụng
- **Sidebar Navigation**: Fixed sidebar với active state
- **Page Header**: Title, subtitle, actions
- **Data Table**: Sortable, filterable, pagination
- **KPI Cards**: Icon, value, trend indicator
- **Status Badges**: Success, Warning, Error, Info, Neutral
- **Buttons**: Primary, Secondary, Ghost

### JavaScript Features
- Sidebar toggle (mobile)
- Dropdown menus
- Modal dialogs
- Table sorting & filtering
- Form handling
- Notifications
- API utilities
- Date/Currency formatting

## 🔧 Customization

### Thay đổi màu sắc

Chỉnh sửa CSS variables trong `assets/css/design-system.css`:

```css
:root {
    --primary: #000000;
    --secondary: #006a61;
    --background: #fcf8fa;
    /* ... */
}
```

### Thêm màn hình mới

1. Copy template từ một màn hình hiện có
2. Cập nhật `data-page` attribute trong `<body>`
3. Thay đổi nội dung chính
4. Thêm link vào sidebar

### Tích hợp API

Sử dụng `ERPApp.apiCall()` trong `assets/js/app.js`:

```javascript
// Example
const data = await ERPApp.apiCall('/employees', {
    method: 'GET'
});
```

## 📱 Responsive Design

- **Desktop**: Full layout với sidebar
- **Tablet**: Sidebar collapse
- **Mobile**: Hamburger menu, single column grid

## ⚡ Performance

- Sử dụng CSS variables cho theming
- Minimal JavaScript dependencies
- Lazy loading cho images
- Optimized table rendering

## 🔒 Security Notes

- Input validation cần được thêm vào forms
- XSS protection cần được implement
- CSRF tokens cho API calls
- Authentication/Authorization cần được tích hợp

## 📚 Tài liệu tham khảo

- Design System: `note/stitch_v_n_h_nh_erp_ui_demo/stitch_v_n_h_nh_erp_ui_demo/v_n_h_nh_erp_core/DESIGN.md`
- Quy tắc phát triển: `note/template_quy_tac_phat_trien.md`
- Quy tắc thiết kế: `note/template_quy_tac_lam_viec_nhom.md`

## 🐛 Known Issues

- Dropdown menu cần click outside để đóng
- Table sorting chưa được implement đầy đủ
- Mobile navigation chưa hoàn thiện
- Mock data cần được tách ra file JSON riêng

## 🚧 TODO

- [ ] Thêm màn hình chi tiết nhân viên
- [ ] Thêm màn hình chi tiết dự án
- [ ] Thêm màn hình chi tiết công việc
- [ ] Implement modal components
- [ ] Thêm form validation
- [ ] Tích hợp charts/graphs
- [ ] Thêm dark mode
- [ ] Responsive improvements
- [ ] Accessibility (ARIA labels)
- [ ] Unit tests

## 📞 Support

Để được hỗ trợ, vui lòng tham khảo:
- Quy tắc làm việc nhóm
- Design system documentation
- Code review checklist

---

**Version**: 1.0.0  
**Last Updated**: 04/05/2026  
**Author**: Development Team
"# ERP" 
