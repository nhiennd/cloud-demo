import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
          <a href="#topology" class="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 9 6 6m0-6-6 6"/>
            </svg>
            Xem Kiến Trúc Module
          </a>
        </div>
      </header>

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
              Shell chính chứa khung giao diện, quản lý router navigation, chia sẻ các thư viện cốt lõi (Angular Core, Router, RxJS).
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
                <span class="label">Loại cấu hình:</span>
                <span class="value badge badge-host">Host Container</span>
              </div>
            </div>
          </div>

          <!-- Connection Bridge -->
          <div class="bridge-indicator">
            <div class="bridge-line">
              <span class="line-pulse"></span>
            </div>
            <div class="bridge-badge">Webpack Module Federation</div>
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
              Ứng dụng quản trị tài nguyên đám mây (Cloud instances, Storage, Kubernetes). Có thể chạy độc lập hoặc nhúng vào host.
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
      padding: 3rem 1rem 4rem;
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
      font-size: 1.125rem;
      color: #9ca3af;
      max-width: 720px;
      margin: 0 auto 2.5rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.6rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
      color: #fff;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.35);
    }

    .btn-primary:hover {
      box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e5e7eb;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .section-topology, .section-guide {
      margin-top: 3.5rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #f3f4f6;
    }

    .topology-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .topology-grid {
        grid-template-columns: 1fr;
      }
      .bridge-indicator {
        transform: rotate(90deg);
        margin: 1rem 0;
      }
    }

    .topology-card {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.8rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .topology-card:hover {
      border-color: rgba(59, 130, 246, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .card-tag {
      position: absolute;
      top: 1rem;
      right: 1.2rem;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.05em;
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
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #60a5fa;
      margin-bottom: 1.2rem;
    }

    .remote-card .card-icon {
      color: #34d399;
    }

    .topology-card h3 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.6rem;
    }

    .card-desc {
      color: #9ca3af;
      font-size: 0.92rem;
      margin-bottom: 1.4rem;
      line-height: 1.5;
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
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

    .meta-row .code {
      font-family: 'JetBrains Mono', monospace;
      color: #e5e7eb;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }

    .badge-host {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
    }

    .card-footer {
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .card-link {
      color: #34d399;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-block;
      transition: transform 0.2s;
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
export class HostDashboardComponent {}
