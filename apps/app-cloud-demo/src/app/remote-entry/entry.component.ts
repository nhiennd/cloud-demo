import { Component } from '@angular/core';
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
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">Tải CPU Trung Bình</span>
            <div class="metric-value">{{ averageCpu }}%</div>
            <span class="metric-delta text-blue">4 vCPU / Instance</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/>
              <path d="m8 17 4 4 4-4"/>
            </svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">Lưu Trữ S3 Storage</span>
            <div class="metric-value">2.4 TB</div>
            <span class="metric-delta text-purple">3 Buckets kích hoạt</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">Chi Phí Ước Tính</span>
            <div class="metric-value">$142.80</div>
            <span class="metric-delta text-amber">Chu kỳ tháng 10</span>
          </div>
        </div>
      </div>

      <!-- Cloud Instances Table -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Danh Sách Máy Chủ Đám Mây (Cloud Virtual Machines)</h3>
          <span class="table-badge">{{ instances.length }} tài nguyên</span>
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
      padding: 2rem 1.5rem 3rem;
    }

    .remote-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.05));
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 12px;
      padding: 0.8rem 1.2rem;
      margin-bottom: 2rem;
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
      letter-spacing: -0.02em;
      color: #f9fafb;
      margin-bottom: 0.4rem;
    }

    .cloud-subtitle {
      color: #9ca3af;
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.2rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-ping {
      background: rgba(255, 255, 255, 0.05);
      color: #e5e7eb;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-ping:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .btn-add {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }

    .btn-add:hover {
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
      transform: translateY(-1px);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: transform 0.2s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .metric-icon {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .icon-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .icon-purple { background: rgba(139, 92, 246, 0.15); color: #c084fc; }
    .icon-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

    .metric-label {
      font-size: 0.8rem;
      color: #9ca3af;
      font-weight: 500;
    }

    .metric-value {
      font-size: 1.45rem;
      font-weight: 800;
      color: #f9fafb;
      line-height: 1.2;
      margin: 0.2rem 0;
    }

    .metric-delta {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .text-emerald { color: #34d399; }
    .text-blue { color: #60a5fa; }
    .text-purple { color: #c084fc; }
    .text-amber { color: #fbbf24; }

    .table-card {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      overflow: hidden;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
    }

    .table-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f3f4f6;
    }

    .table-badge {
      font-size: 0.78rem;
      color: #9ca3af;
      background: rgba(255, 255, 255, 0.06);
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
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
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      padding: 0.8rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-weight: 600;
    }

    .cloud-table td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.88rem;
      color: #d1d5db;
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
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      color: #9ca3af;
    }

    .code-font {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
    }

    .cpu-bar-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100px;
    }

    .cpu-bar {
      height: 6px;
      background: linear-gradient(90deg, #3b82f6, #06b6d4);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .cpu-text {
      font-size: 0.75rem;
      color: #9ca3af;
      font-family: 'JetBrains Mono', monospace;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge.running {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-badge.stopped {
      background: rgba(107, 114, 128, 0.15);
      color: #9ca3af;
      border: 1px solid rgba(107, 114, 128, 0.3);
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
export class RemoteEntryComponent {
  pingLatency: number | null = 14;

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
