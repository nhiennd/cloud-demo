import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleAuthService } from '../core/auth/google-auth.service';

@Component({
  selector: 'app-host-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Hero Banner -->
      <header class="hero-section">
        <div class="badge-pill">
          <span class="pulse-dot"></span>
          <span>Angular 18 Micro-Frontend Architecture</span>
        </div>
        <h1 class="hero-title">
          Hệ Thống Phân Tán <span class="gradient-text">Nx Module Federation</span>
        </h1>
        <p class="hero-desc">
          Ứng dụng bao gồm <strong>app-host</strong> (Host Shell đóng vai trò điều phối layout & routing)
          và <strong>app-cloud-demo</strong> (Micro-Frontend Remote được tải động lúc runtime).
        </p>

        <div class="hero-actions">
          <a routerLink="/app-cloud-demo" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
            Truy Cập App Remote (app-cloud-demo)
          </a>
          <button type="button" class="btn btn-google" (click)="handleAuthAction()">
            <svg class="google-logo" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
            </svg>
            {{ authService.isAuthenticated() ? 'Quản Lý Tài Khoản Google' : 'Đăng Nhập Với Google' }}
          </button>
        </div>
      </header>

      <!-- Google Authentication Showcase Card -->
      <section class="section-auth-banner">
        <div class="auth-showcase-card" [class.authenticated]="authService.isAuthenticated()">
          <!-- Unauthenticated State -->
          <div *ngIf="!authService.isAuthenticated()" class="auth-unauth-content">
            <div class="auth-left">
              <div class="auth-icon-badge">
                <svg width="32" height="32" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
                </svg>
              </div>
              <div>
                <div class="auth-pill">GOOGLE SINGLE SIGN-ON (SSO)</div>
                <h3 class="auth-headline">Đăng Nhập Liên Kết Tài Khoản Google</h3>
                <p class="auth-lead">
                  Hệ thống hỗ trợ chuẩn <strong>Google Identity Services (OAuth 2.0 / OpenID Connect)</strong>.
                  Sau khi đăng nhập, phiên làm việc sẽ được đồng bộ tự động tới toàn bộ các ứng dụng Micro-Frontend (Remote).
                </p>
              </div>
            </div>
            <div class="auth-right">
              <button type="button" class="btn btn-connect" (click)="authService.openLoginModal()">
                <span>Liên Kết Tài Khoản Ngay</span>
                &rarr;
              </button>
            </div>
          </div>

          <!-- Authenticated State -->
          <div *ngIf="authService.currentUser() as user" class="auth-logged-content">
            <div class="auth-user-info">
              <div class="auth-avatar-box">
                <img
                  *ngIf="user.picture"
                  [src]="user.picture"
                  [alt]="user.name"
                  class="auth-avatar"
                  (error)="user.picture = ''"
                />
                <div *ngIf="!user.picture" class="auth-avatar-fallback">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="auth-user-text">
                <div class="auth-verified-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{{ user.authProvider === 'google' ? 'Đã Kết Nối Google OAuth' : 'Chế Độ Thử Nghiệm Demo' }}</span>
                </div>
                <h3 class="auth-greeting">Xin chào, {{ user.name }}!</h3>
                <p class="auth-user-email">{{ user.email }} • Google UID: <code>{{ user.sub.substring(0, 16) }}...</code></p>
              </div>
            </div>

            <div class="auth-user-actions">
              <button type="button" class="btn btn-outline" (click)="authService.openProfileModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Xem Chi Tiết Token
              </button>
              <button type="button" class="btn btn-outline-danger" (click)="authService.logout()">
                Đăng Xuất
              </button>
            </div>
          </div>

          <!-- Feature Points Grid -->
          <div class="auth-features-row">
            <div class="feature-item">
              <div class="feature-bullet"></div>
              <span><strong>Google Identity Services:</strong> Thư viện GIS hiện đại, One Tap & Google Button.</span>
            </div>
            <div class="feature-item">
              <div class="feature-bullet"></div>
              <span><strong>Cross-MFE State:</strong> Tự động đồng bộ phiên đăng nhập giữa Host & Remote.</span>
            </div>
            <div class="feature-item">
              <div class="feature-bullet"></div>
              <span><strong>Bảo mật JWT:</strong> Giải mã token chuẩn Base64URL hỗ trợ đầy đủ ký tự tiếng Việt.</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Architecture Topology Section -->
      <section id="topology" class="section-topology">
        <h2 class="section-title">Cấu Trúc Các Ứng Dụng Trong Monorepo</h2>
        
        <div class="topology-grid">
          <!-- Host Card -->
          <div class="topology-card host-card">
            <div class="card-tag host-tag">HOST APPLICATION</div>
            <div class="card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>
              </svg>
            </div>
            <h3>app-host</h3>
            <p class="card-desc">
              Shell chính chứa khung giao diện, quản lý router navigation, cung cấp xác thực Google SSO và chia sẻ thư viện dùng chung.
            </p>
            <div class="card-meta">
              <div class="meta-row">
                <span class="label">Cổng phục vụ:</span>
                <span class="value code">http://localhost:4200</span>
              </div>
              <div class="meta-row">
                <span class="label">Thư mục nguồn:</span>
                <span class="value code">apps/app-host</span>
              </div>
              <div class="meta-row">
                <span class="label">Auth Module:</span>
                <span class="value badge badge-host">Google Identity Services</span>
              </div>
            </div>
          </div>

          <!-- Connection Bridge -->
          <div class="bridge-indicator">
            <div class="bridge-line">
              <span class="line-pulse"></span>
            </div>
            <div class="bridge-badge">Webpack Module Federation + SSO</div>
          </div>

          <!-- Remote Card -->
          <div class="topology-card remote-card">
            <div class="card-tag remote-tag">REMOTE APPLICATION</div>
            <div class="card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
              </svg>
            </div>
            <h3>app-cloud-demo</h3>
            <p class="card-desc">
              Ứng dụng quản trị tài nguyên đám mây (Cloud instances, Storage, Kubernetes). Nhận trạng thái xác thực từ Host.
            </p>
            <div class="card-meta">
              <div class="meta-row">
                <span class="label">Cổng phục vụ:</span>
                <span class="value code">http://localhost:4201</span>
              </div>
              <div class="meta-row">
                <span class="label">Thư mục nguồn:</span>
                <span class="value code">apps/app-cloud-demo</span>
              </div>
              <div class="meta-row">
                <span class="label">Remote Entry:</span>
                <span class="value code">remoteEntry.mjs (./Routes)</span>
              </div>
            </div>
            <div class="card-footer">
              <a routerLink="/app-cloud-demo" class="card-link">Mở Remote trong Host &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Commands Guide -->
      <section class="section-guide">
        <h2 class="section-title">Lệnh Khởi Chạy Nhanh</h2>
        <div class="code-cards-grid">
          <div class="code-card">
            <div class="code-header">
              <span>Chạy đồng thời cả Host + Remote</span>
              <span class="code-badge">Khuyên dùng</span>
            </div>
            <pre><code>npm start</code></pre>
            <p class="code-note">Nx sẽ tự động khởi động Host ở port 4200 và Remote ở port 4201.</p>
          </div>

          <div class="code-card">
            <div class="code-header">
              <span>Chạy riêng lẻ từng app</span>
              <span class="code-badge">Development</span>
            </div>
            <pre><code>npm run serve:host     # Chạy riêng app-host (4200)
npm run serve:remote   # Chạy riêng app-cloud-demo (4201)</code></pre>
            <p class="code-note">Hỗ trợ phát triển và kiểm thử độc lập từng micro-app.</p>
          </div>

          <div class="code-card">
            <div class="code-header">
              <span>Build toàn bộ Monorepo</span>
              <span class="code-badge">Production</span>
            </div>
            <pre><code>npm run build</code></pre>
            <p class="code-note">Tạo bản bundle tối ưu hóa và xuất ra thư mục <code>dist/apps/</code>.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }

    .hero-section {
      text-align: center;
      padding: 3rem 1rem 3.5rem;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: #3b82f6;
      border-radius: 50%;
      box-shadow: 0 0 8px #3b82f6;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .hero-title {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 1.15rem;
      color: #9ca3af;
      max-width: 720px;
      margin: 0 auto 2.5rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.8rem 1.6rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
    }

    .btn-primary:hover {
      box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5);
      transform: translateY(-2px);
    }

    .btn-google {
      background: rgba(255, 255, 255, 0.08);
      color: #f9fafb;
      border: 1px solid rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(8px);
    }

    .btn-google:hover {
      background: rgba(255, 255, 255, 0.14);
      border-color: rgba(96, 165, 250, 0.5);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
    }

    /* Auth Showcase Banner */
    .section-auth-banner {
      margin-bottom: 3.5rem;
    }

    .auth-showcase-card {
      background: linear-gradient(135deg, rgba(20, 27, 45, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid rgba(59, 130, 246, 0.25);
      border-radius: 20px;
      padding: 2rem 2.25rem;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .auth-showcase-card.authenticated {
      border-color: rgba(16, 185, 129, 0.35);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(16, 185, 129, 0.12);
    }

    .auth-unauth-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .auth-left {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      flex: 1;
      min-width: 280px;
    }

    .auth-icon-badge {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .auth-pill {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #60a5fa;
      margin-bottom: 0.35rem;
    }

    .auth-headline {
      font-size: 1.35rem;
      font-weight: 700;
      color: #f9fafb;
      margin-bottom: 0.45rem;
    }

    .auth-lead {
      font-size: 0.9rem;
      color: #9ca3af;
      line-height: 1.5;
    }

    .btn-connect {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: white;
      border: none;
      padding: 0.85rem 1.6rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
      }
    }

    /* Authenticated Content */
    .auth-logged-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .auth-user-info {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .auth-avatar-box {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #10b981;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);
      flex-shrink: 0;
    }

    .auth-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .auth-avatar-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-size: 1.6rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .auth-verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.15rem 0.55rem;
      border-radius: 12px;
      margin-bottom: 0.3rem;
    }

    .auth-greeting {
      font-size: 1.35rem;
      font-weight: 700;
      color: #f9fafb;
      margin-bottom: 0.2rem;
    }

    .auth-user-email {
      font-size: 0.85rem;
      color: #9ca3af;

      code {
        background: rgba(255, 255, 255, 0.08);
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        color: #93c5fd;
      }
    }

    .auth-user-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e5e7eb;
      padding: 0.65rem 1.2rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.25);
      }
    }

    .btn-outline-danger {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.65rem 1.2rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.22);
      }
    }

    .auth-features-row {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.82rem;
      color: #9ca3af;

      .feature-bullet {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #3b82f6;
        flex-shrink: 0;
      }

      strong {
        color: #f3f4f6;
      }
    }

    /* Section Topology & Architecture */
    .section-topology, .section-guide {
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 2rem;
      text-align: center;
    }

    .topology-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .topology-card {
      flex: 1;
      min-width: 320px;
      max-width: 480px;
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.75rem;
      position: relative;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .topology-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.16);
    }

    .card-tag {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
    }

    .host-tag {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .remote-tag {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .host-card .card-icon {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .remote-card .card-icon {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }

    .topology-card h3 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .card-desc {
      font-size: 0.9rem;
      color: #9ca3af;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      min-height: 48px;
    }

    .card-meta {
      background: rgba(11, 15, 25, 0.6);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .meta-row .label {
      color: #6b7280;
    }

    .meta-row .value.code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #e5e7eb;
    }

    .meta-row .badge {
      font-size: 0.72rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .badge-host {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
    }

    .card-footer {
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .card-link {
      color: #34d399;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      transition: transform 0.2s ease;
    }

    .card-link:hover {
      transform: translateX(4px);
    }

    .bridge-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .bridge-line {
      width: 80px;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #10b981);
      position: relative;
    }

    .bridge-badge {
      font-size: 0.75rem;
      color: #9ca3af;
      font-weight: 500;
      white-space: nowrap;
    }

    .code-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .code-card {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.4rem;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      font-weight: 600;
      color: #e5e7eb;
      margin-bottom: 0.8rem;
    }

    .code-badge {
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: #9ca3af;
    }

    pre {
      background: #080c14;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 0.9rem 1rem;
      overflow-x: auto;
      margin-bottom: 0.8rem;
    }

    pre code {
      color: #38bdf8;
      font-size: 0.85rem;
    }

    .code-note {
      font-size: 0.82rem;
      color: #6b7280;
      line-height: 1.4;
    }
  `]
})
export class HostDashboardComponent {
  readonly authService = inject(GoogleAuthService);

  handleAuthAction(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.openProfileModal();
    } else {
      this.authService.openLoginModal();
    }
  }
}
