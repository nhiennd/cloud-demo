import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CloudInstance {
  id: string;
  name: string;
  region: string;
  type: string;
  ip: string;
  cpu: number;
  status: 'running' | 'stopped';
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-app-cloud-demo-entry',
  template: `
    <div class="remote-wrapper">
      <!-- Remote Banner Indicator -->
      <div class="remote-banner">
        <div class="banner-badge">
          <span class="live-pulse"></span>
          <span>MICRO-FRONTEND REMOTE LOADED</span>
        </div>
        <div class="banner-info">
          <span>Module: <strong>app-cloud-demo</strong></span>
          <span class="separator">•</span>
          <span>Source: <code>http://localhost:4201/remoteEntry.mjs</code></span>
        </div>
      </div>

      <!-- Google SSO Sync Banner in Remote MFE -->
      <div class="sso-banner" [class.logged-in]="!!currentUser">
        <div class="sso-left">
          <div class="sso-icon">
            <svg class="google-icon" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
            </svg>
          </div>
          <div class="sso-text" *ngIf="currentUser">
            <span class="sso-tag">GOOGLE SSO ĐỒNG BỘ THÀNH CÔNG</span>
            <div class="sso-details">
              Xin chào <strong>{{ currentUser.name }}</strong> ({{ currentUser.email }}) — Quyền Quản trị viên Cloud được xác thực qua Google.
            </div>
          </div>
          <div class="sso-text" *ngIf="!currentUser">
            <span class="sso-tag guest">CHƯA ĐĂNG NHẬP GOOGLE</span>
            <div class="sso-details">
              Đang hoạt động ở chế độ khách (Guest). Vui lòng đăng nhập Google ở thanh điều hướng để mở khóa đầy đủ quyền hạn.
            </div>
          </div>
        </div>
        <div class="sso-badge-status" [class.active]="!!currentUser">
          <span class="dot"></span>
          <span>{{ currentUser ? 'SSO Active' : 'Guest Mode' }}</span>
        </div>
      </div>

      <!-- Header -->
      <div class="cloud-header">
        <div>
          <h2 class="cloud-title">Trung Tâm Điều Khiển Đám Mây (Cloud Demo)</h2>
          <p class="cloud-subtitle">
            Quản lý máy chủ ảo, lưu trữ dữ liệu và cụm dịch vụ được phân phối từ Remote Application.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn btn-ping" (click)="pingCluster()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Kiểm tra kết nối ({{ pingLatency ? pingLatency + ' ms' : 'Ping' }})
          </button>
          <button class="btn btn-add" (click)="addInstance()">
            + Thêm Máy Chủ Mới
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
              <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
              <line x1="6" x2="6.01" y1="6" y2="6"/>
              <line x1="6" x2="6.01" y1="18" y2="18"/>
            </svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">Máy chủ đang chạy</span>
            <div class="metric-value">{{ runningCount }} / {{ instances.length }}</div>
            <span class="metric-delta text-emerald">↑ 100% Sẵn sàng</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">Độ trễ trung bình</span>
            <div class="metric-value">{{ pingLatency }} ms</div>
            <span class="metric-delta text-emerald">Tối ưu (ap-southeast-1)</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-violet">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">Chi phí ước tính / Giờ</span>
            <div class="metric-value">$0.48 / h</div>
            <span class="metric-delta text-muted">~ 11,500 đ / h</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20v-6M6 20V10M18 20V4"/>
            </svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">Tải CPU Cụm</span>
            <div class="metric-value">{{ averageCpu }}%</div>
            <span class="metric-delta text-amber">Ổn định</span>
          </div>
        </div>
      </div>

      <!-- Cloud Instances Table -->
      <div class="table-container">
        <div class="table-header">
          <h3 class="table-title">Danh Sách Máy Chủ Ảo Đang Hoạt Động</h3>
          <span class="table-count">{{ instances.length }} tài nguyên</span>
        </div>

        <div class="table-responsive">
          <table class="cloud-table">
            <thead>
              <tr>
                <th>Tên máy chủ</th>
                <th>Khu vực (Region)</th>
                <th>Cấu hình</th>
                <th>Địa chỉ IP</th>
                <th>CPU</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of instances">
                <td class="col-name">
                  <div class="instance-name">
                    <span class="name-bold">{{ item.name }}</span>
                    <span class="instance-id">{{ item.id }}</span>
                  </div>
                </td>
                <td>
                  <span class="region-pill">{{ item.region }}</span>
                </td>
                <td class="code-font">{{ item.type }}</td>
                <td class="code-font">{{ item.ip }}</td>
                <td>
                  <div class="cpu-bar-container">
                    <div class="cpu-bar" [style.width.%]="item.status === 'running' ? item.cpu : 0"></div>
                    <span class="cpu-text">{{ item.status === 'running' ? item.cpu + '%' : '0%' }}</span>
                  </div>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="item.status">
                    <span class="badge-dot"></span>
                    {{ item.status === 'running' ? 'Đang Chạy' : 'Tạm Dừng' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn-action" 
                    [ngClass]="item.status === 'running' ? 'btn-stop' : 'btn-start'"
                    (click)="toggleStatus(item)">
                    {{ item.status === 'running' ? 'Dừng' : 'Bật' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .remote-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    .remote-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 12px;
      padding: 0.8rem 1.2rem;
      margin-bottom: 1.25rem;
    }

    .banner-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #34d399;
      letter-spacing: 0.04em;
    }

    .live-pulse {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.8); }
    }

    .banner-info {
      font-size: 0.82rem;
      color: #9ca3af;
    }

    .banner-info strong {
      color: #e5e7eb;
    }

    .banner-info code {
      color: #6ee7b7;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }

    .separator {
      margin: 0 0.5rem;
      color: #4b5563;
    }

    /* Google SSO Banner */
    .sso-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 0.85rem 1.25rem;
      margin-bottom: 2rem;
      transition: all 0.25s ease;
    }

    .sso-banner.logged-in {
      background: linear-gradient(135deg, rgba(66, 133, 244, 0.12) 0%, rgba(52, 168, 83, 0.08) 100%);
      border-color: rgba(66, 133, 244, 0.35);
      box-shadow: 0 4px 16px rgba(66, 133, 244, 0.1);
    }

    .sso-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sso-icon {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sso-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .sso-tag {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #60a5fa;
    }

    .sso-tag.guest {
      color: #9ca3af;
    }

    .sso-details {
      font-size: 0.84rem;
      color: #d1d5db;
    }

    .sso-details strong {
      color: #f9fafb;
    }

    .sso-badge-status {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.06);
      color: #9ca3af;
      border: 1px solid rgba(255, 255, 255, 0.1);
      white-space: nowrap;
    }

    .sso-badge-status .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #9ca3af;
    }

    .sso-badge-status.active {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border-color: rgba(16, 185, 129, 0.3);
    }

    .sso-badge-status.active .dot {
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .cloud-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .cloud-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #f9fafb;
      margin-bottom: 0.35rem;
      letter-spacing: -0.02em;
    }

    .cloud-subtitle {
      font-size: 0.95rem;
      color: #9ca3af;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.15rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-ping {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e5e7eb;
    }

    .btn-ping:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .btn-add {
      background: #3b82f6;
      color: #fff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-add:hover {
      background: #2563eb;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    .metric-card {
      background: rgba(17, 24, 39, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .icon-blue    { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .icon-violet  { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }
    .icon-amber   { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

    .metric-body {
      display: flex;
      flex-direction: column;
    }

    .metric-label {
      font-size: 0.8rem;
      color: #9ca3af;
      margin-bottom: 0.25rem;
    }

    .metric-value {
      font-size: 1.4rem;
      font-weight: 700;
      color: #f9fafb;
      line-height: 1.2;
      margin-bottom: 0.2rem;
    }

    .metric-delta {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .text-emerald { color: #34d399; }
    .text-amber   { color: #fbbf24; }
    .text-muted   { color: #9ca3af; }

    .table-container {
      background: rgba(17, 24, 39, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
    }

    .table-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f9fafb;
    }

    .table-count {
      font-size: 0.78rem;
      background: rgba(255, 255, 255, 0.08);
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      color: #9ca3af;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .cloud-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .cloud-table th {
      background: rgba(11, 15, 25, 0.6);
      padding: 0.85rem 1.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .cloud-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.88rem;
      color: #d1d5db;
    }

    .cloud-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .instance-name {
      display: flex;
      flex-direction: column;
    }

    .name-bold {
      font-weight: 600;
      color: #f9fafb;
    }

    .instance-id {
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'JetBrains Mono', monospace;
    }

    .region-pill {
      font-size: 0.78rem;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .code-font {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: #93c5fd;
    }

    .cpu-bar-container {
      width: 120px;
      background: rgba(255, 255, 255, 0.08);
      height: 6px;
      border-radius: 3px;
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.5rem;
    }

    .cpu-bar {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      transition: width 0.3s ease;
    }

    .cpu-text {
      font-size: 0.78rem;
      font-family: 'JetBrains Mono', monospace;
      color: #9ca3af;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.65rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge.running {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-badge.stopped {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .btn-action {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-stop {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-stop:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    .btn-start {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .btn-start:hover {
      background: rgba(16, 185, 129, 0.25);
    }
  `]
})
export class RemoteEntryComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  pingLatency: number | null = 14;

  private authListener = (event: any) => {
    this.currentUser = event.detail;
  };

  private storageListener = (event: StorageEvent) => {
    if (event.key === 'ncloudlab_google_user' || event.key === 'oneportal_google_user') {
      this.loadUserFromStorage();
    }
  };

  instances: CloudInstance[] = [
    {
      id: 'i-0a817f9b',
      name: 'prod-api-gateway-01',
      region: 'ap-southeast-1 (Singapore)',
      type: 'c6g.xlarge',
      ip: '10.0.12.44',
      cpu: 48,
      status: 'running'
    },
    {
      id: 'i-0b329c4d',
      name: 'prod-auth-service-01',
      region: 'ap-southeast-1 (Singapore)',
      type: 't4g.medium',
      ip: '10.0.14.88',
      cpu: 22,
      status: 'running'
    },
    {
      id: 'i-0f722a11',
      name: 'worker-queue-rabbitmq',
      region: 'us-east-1 (N. Virginia)',
      type: 'r6g.large',
      ip: '10.1.5.12',
      cpu: 64,
      status: 'running'
    },
    {
      id: 'i-0c918e33',
      name: 'staging-k8s-node-02',
      region: 'eu-central-1 (Frankfurt)',
      type: 't4g.small',
      ip: '10.2.1.99',
      cpu: 10,
      status: 'stopped'
    }
  ];

  ngOnInit(): void {
    this.loadUserFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('ncloudlab:auth-change', this.authListener);
      window.addEventListener('oneportal:auth-change', this.authListener);
      window.addEventListener('storage', this.storageListener);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('ncloudlab:auth-change', this.authListener);
      window.removeEventListener('oneportal:auth-change', this.authListener);
      window.removeEventListener('storage', this.storageListener);
    }
  }

  private loadUserFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('ncloudlab_google_user') || localStorage.getItem('oneportal_google_user');
      this.currentUser = data ? JSON.parse(data) : null;
    } catch {
      this.currentUser = null;
    }
  }

  get runningCount(): number {
    return this.instances.filter(i => i.status === 'running').length;
  }

  get averageCpu(): number {
    const running = this.instances.filter(i => i.status === 'running');
    if (running.length === 0) return 0;
    const sum = running.reduce((acc, curr) => acc + curr.cpu, 0);
    return Math.round(sum / running.length);
  }

  toggleStatus(instance: CloudInstance): void {
    instance.status = instance.status === 'running' ? 'stopped' : 'running';
  }

  pingCluster(): void {
    this.pingLatency = Math.floor(Math.random() * 20) + 8;
  }

  addInstance(): void {
    const count = this.instances.length + 1;
    const newId = 'i-0' + Math.random().toString(16).substring(2, 9);
    this.instances.push({
      id: newId,
      name: `cloud-service-node-0${count}`,
      region: 'ap-southeast-1 (Singapore)',
      type: 't4g.medium',
      ip: `10.0.16.${Math.floor(Math.random() * 200) + 10}`,
      cpu: Math.floor(Math.random() * 40) + 15,
      status: 'running'
    });
  }
}
