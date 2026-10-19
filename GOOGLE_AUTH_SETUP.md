# Hướng Dẫn Cấu Hình Và Sử Dụng Đăng Nhập Google (Google OAuth / SSO)

Chức năng đăng nhập Google trong hệ thống NCloudLab được xây dựng dựa trên chuẩn **Google Identity Services (GIS)** mới nhất từ Google, kết hợp đồng bộ phiên làm việc (Single Sign-On - SSO) xuyên suốt giữa **Host Shell (app-host)** và các **Remote Micro-Frontend (app-cloud-demo)**.

---

## 🌟 Tính Năng Chính

1. **Chuẩn Google Identity Services (GIS) mới nhất**:
   - Sử dụng SDK `https://accounts.google.com/gsi/client`.
   - Nút đăng nhập chính thức của Google tự động render với bảo mật OAuth 2.0 / OpenID Connect.
   - Hỗ trợ giải mã JWT ID Token (Base64URL với hỗ trợ Unicode tiếng Việt đầy đủ).
2. **Đồng bộ phiên làm việc Micro-Frontend (Cross-MFE SSO)**:
   - Khi đăng nhập tại `app-host`, thông tin người dùng được phát tán qua sự kiện `ncloudlab:auth-change` và `localStorage`.
   - Ứng dụng con `app-cloud-demo` tự động nhận diện tài khoản Google và hiển thị trạng thái quyền hạn tương ứng tức thì.
3. **Chế độ Thử nghiệm Nhanh (1-Click Demo Mode)**:
   - Cho phép kiểm thử toàn bộ luồng đăng nhập, hồ sơ người dùng, claims token, và đăng xuất mà không cần tạo Client ID trên Google Cloud trước.
4. **Cấu hình Client ID linh hoạt ngay trên giao diện**:
   - Nhập và lưu `GOOGLE_CLIENT_ID` của bạn trực tiếp trong modal đăng nhập mà không cần sửa code.

---

## 🔑 Hướng Dẫn Tạo Google OAuth Client ID

Nếu bạn muốn liên kết với tài khoản Google thật của dự án:

1. **Truy cập Google Cloud Console**:
   - Mở [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. **Tạo Dự án mới** (hoặc chọn dự án có sẵn).
3. **Cấu hình OAuth Consent Screen**:
   - Chọn User Type: **External** (hoặc Internal nếu dùng Google Workspace nội bộ).
   - Điền App Name (ví dụ: `NCloudLab Cloud Demo`) và User Support Email.
4. **Tạo OAuth Client ID**:
   - Nhấn **Create Credentials** &rarr; Chọn **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `NCloudLab Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:4200` (địa chỉ Host App)
     - `http://localhost`
     - Domain production của bạn (ví dụ: `https://your-domain.com`).
   - Nhấn **Create**.
5. **Sử dụng Client ID**:
   - Copy mã Client ID dạng: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`.
   - Trên giao diện NCloudLab, nhấn **Đăng Nhập Google** &rarr; mở **Cấu hình Google OAuth Client ID** &rarr; Dán Client ID vào và nhấn **Lưu & Tải Lại**.

---

## 📁 Cấu Trúc Mã Nguồn Google Auth

```text
apps/app-host/src/app/core/auth/
├── google-user.model.ts              # Interface GoogleUserProfile, GoogleJwtPayload
├── google-auth.service.ts            # Service quản lý GIS, signals, MFE broadcast, demo login
├── auth.guard.ts                     # Route Guard bảo vệ các trang yêu cầu đăng nhập
├── login-modal/
│   ├── login-modal.component.ts      # Modal đăng nhập Google chính thức + Demo fallback + Cấu hình Client ID
│   └── login-modal.component.scss    # Thiết kế Glassmorphic dark theme cao cấp
└── profile-modal/
    ├── profile-modal.component.ts    # Modal xem chi tiết hồ sơ tài khoản, Google UID, JWT claims
    └── profile-modal.component.scss
```

---

## 🚀 Khởi Chạy Ứng Dụng

```bash
# Chạy đồng thời cả Host (4200) và Remote (4201)
npm start
```

Truy cập trình duyệt tại: `http://localhost:4200`
- Nhấn nút **Đăng Nhập Google** trên thanh menu trên cùng.
- Hoặc nhấn **Đăng Nhập Với Google** ngay tại trang chủ Dashboard.
