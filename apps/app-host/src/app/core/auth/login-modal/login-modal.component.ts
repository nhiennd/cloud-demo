import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleAuthService } from '../google-auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="authService.isLoginModalOpen()"
      class="modal-backdrop"
      (click)="onBackdropClick($event)"
    >
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button
          class="btn-close"
          (click)="authService.closeLoginModal()"
          aria-label="Đóng"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Header -->
        <div class="modal-header">
          <div class="google-brand-badge">
            <svg class="google-icon" width="28" height="28" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
          </div>
          <h2 class="modal-title">Đăng Nhập Với Google</h2>
          <p class="modal-subtitle">
            Sử dụng tài khoản Google Workspace hoặc Gmail để đăng nhập vào hệ thống NCloudLab.
          </p>
        </div>

        <!-- Alert Error if any -->
        <div *ngIf="authService.errorMessage()" class="alert-box error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ authService.errorMessage() }}</span>
        </div>

        <!-- Loading state -->
        <div *ngIf="authService.isLoading()" class="loading-state">
          <div class="spinner"></div>
          <span>Đang xác thực thông tin tài khoản Google...</span>
        </div>

        <!-- Primary Action: Google Identity Services Official Container -->
        <div class="auth-methods" [class.disabled]="authService.isLoading()">
          <div class="method-card">
            <div class="method-label">Xác thực Google Identity Services (GIS):</div>
            <div #googleBtnContainer class="google-btn-wrapper"></div>
            <div class="gis-hint">
              <span class="dot"></span>
              Nút đăng nhập tự động tích hợp bảo mật OAuth 2.0 từ Google
            </div>
          </div>

          <div class="divider">
            <span>HOẶC</span>
          </div>

          <!-- Fallback Demo Account Button -->
          <button
            type="button"
            class="btn-demo-login"
            (click)="loginWithDemo()"
            [disabled]="authService.isLoading()"
          >
            <div class="demo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <polyline points="16 11 18 13 22 9"></polyline>
              </svg>
            </div>
            <div class="demo-info">
              <span class="demo-title">Đăng Nhập Nhanh (Chế Độ Demo)</span>
              <span class="demo-desc">Mô phỏng tài khoản Google để kiểm tra ngay lập tức</span>
            </div>
            <div class="demo-arrow">→</div>
          </button>
        </div>

        <!-- Collapsible Client ID Configuration Section -->
        <div class="config-section">
          <button
            type="button"
            class="btn-toggle-config"
            (click)="toggleConfig()"
          >
            <span class="config-toggle-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Cấu hình Google OAuth Client ID
            </span>
            <span class="chevron" [class.open]="showConfig()">▼</span>
          </button>

          <div *ngIf="showConfig()" class="config-body">
            <label class="config-label">Google Client ID hiện tại:</label>
            <div class="input-group">
              <input
                type="text"
                [(ngModel)]="customClientId"
                placeholder="xxxx-yyyy.apps.googleusercontent.com"
                class="config-input"
              />
              <button
                type="button"
                class="btn-save-config"
                (click)="saveClientId()"
              >
                Lưu & Tải Lại
              </button>
            </div>
            <div *ngIf="saveSuccessMessage()" class="save-success">
              ✓ {{ saveSuccessMessage() }}
            </div>
            <div class="setup-guide">
              <span class="guide-title">Hướng dẫn lấy Client ID từ Google Cloud:</span>
              <ol>
                <li>Mở <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Google Cloud Console &rarr; Credentials</a></li>
                <li>Chọn <strong>Create Credentials &rarr; OAuth Client ID</strong></li>
                <li>Chọn Application Type: <strong>Web application</strong></li>
                <li>Thêm <code>http://localhost:4200</code> vào <strong>Authorized JavaScript origins</strong></li>
                <li>Copy <strong>Client ID</strong> và dán vào ô trên</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements AfterViewInit {
  readonly authService = inject(GoogleAuthService);

  @ViewChild('googleBtnContainer') googleBtnContainer?: ElementRef<HTMLElement>;

  readonly showConfig = signal<boolean>(false);
  customClientId = '';
  readonly saveSuccessMessage = signal<string | null>(null);

  constructor() {
    this.customClientId = this.authService.clientId();

    // Effect to render button when modal opens
    effect(() => {
      const isOpen = this.authService.isLoginModalOpen();
      if (isOpen) {
        setTimeout(() => this.tryRenderGoogleButton(), 50);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.authService.isLoginModalOpen()) {
      this.tryRenderGoogleButton();
    }
  }

  private tryRenderGoogleButton(): void {
    if (this.googleBtnContainer?.nativeElement) {
      this.authService.renderGoogleSignInButton(
        this.googleBtnContainer.nativeElement,
        {
          theme: 'filled_blue',
          size: 'large',
          width: 320,
        }
      );
    }
  }

  toggleConfig(): void {
    this.showConfig.update((v) => !v);
  }

  saveClientId(): void {
    if (!this.customClientId.trim()) return;
    this.authService.updateClientId(this.customClientId);
    this.saveSuccessMessage.set('Đã lưu Client ID thành công! Đang khởi tạo lại...');
    setTimeout(() => {
      this.tryRenderGoogleButton();
      this.saveSuccessMessage.set(null);
    }, 1500);
  }

  loginWithDemo(): void {
    this.authService.loginWithDemoAccount();
  }

  onBackdropClick(event: MouseEvent): void {
    this.authService.closeLoginModal();
  }
}
