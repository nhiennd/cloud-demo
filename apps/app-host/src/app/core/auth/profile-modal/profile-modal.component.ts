import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAuthService } from '../google-auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="authService.isProfileModalOpen() && authService.currentUser() as user"
      class="modal-backdrop"
      (click)="authService.closeProfileModal()"
    >
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button
          class="btn-close"
          (click)="authService.closeProfileModal()"
          aria-label="Đóng"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- User Profile Hero Header -->
        <div class="profile-header">
          <div class="avatar-wrapper">
            <img
              *ngIf="user.picture"
              [src]="user.picture"
              [alt]="user.name"
              class="user-avatar"
              (error)="user.picture = ''"
            />
            <div *ngIf="!user.picture" class="user-avatar-fallback">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="verified-icon" title="Tài khoản Google đã xác thực">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>

          <h2 class="user-name">{{ user.name }}</h2>
          <p class="user-email">{{ user.email }}</p>

          <div class="provider-pill" [class.google]="user.authProvider === 'google'">
            <svg *ngIf="user.authProvider === 'google'" class="google-mini" width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
            </svg>
            <span>{{ user.authProvider === 'google' ? 'Google OAuth 2.0 Account' : 'Demo Account Emulation' }}</span>
          </div>
        </div>

        <!-- Claims Info Table -->
        <div class="info-list">
          <div class="info-row">
            <span class="info-label">Google Unique ID (sub):</span>
            <code class="info-value">{{ user.sub }}</code>
          </div>

          <div class="info-row">
            <span class="info-label">Email Verified:</span>
            <span class="info-value status-badge" [class.verified]="user.email_verified">
              {{ user.email_verified ? 'Đã xác minh' : 'Chưa xác minh' }}
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Thời gian đăng nhập:</span>
            <span class="info-value">{{ user.loginTime | date: 'dd/MM/yyyy HH:mm:ss' }}</span>
          </div>

          <div class="info-row token-row" *ngIf="user.idToken">
            <span class="info-label">JWT Token (Preview):</span>
            <div class="token-preview-box">
              <code>{{ user.idToken.substring(0, 40) }}...{{ user.idToken.substring(user.idToken.length - 20) }}</code>
              <button class="btn-copy" (click)="copyToken(user.idToken)">
                {{ copySuccess ? 'Đã chép!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="authService.closeProfileModal()">
            Đóng
          </button>
          <button type="button" class="btn-logout" (click)="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile-modal.component.scss'],
})
export class ProfileModalComponent {
  readonly authService = inject(GoogleAuthService);
  copySuccess = false;

  logout(): void {
    this.authService.logout();
  }

  copyToken(token: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(token).then(() => {
        this.copySuccess = true;
        setTimeout(() => (this.copySuccess = false), 2000);
      });
    }
  }
}
