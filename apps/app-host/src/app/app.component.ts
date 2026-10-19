import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleAuthService } from './core/auth/google-auth.service';
import { LoginModalComponent } from './core/auth/login-modal/login-modal.component';
import { ProfileModalComponent } from './core/auth/profile-modal/profile-modal.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginModalComponent,
    ProfileModalComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'NCloudLab Host';
  readonly authService = inject(GoogleAuthService);
  readonly isUserMenuOpen = signal<boolean>(false);

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((v) => !v);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  openLoginModal(): void {
    this.authService.openLoginModal();
    this.closeUserMenu();
  }

  openProfileModal(): void {
    this.authService.openProfileModal();
    this.closeUserMenu();
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
  }
}
