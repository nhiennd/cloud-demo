import { Injectable, signal, computed } from '@angular/core';
import { GoogleUserProfile, GoogleJwtPayload } from './google-user.model';

declare const google: any;

const STORAGE_KEY_USER = 'ncloudlab_google_user';
const STORAGE_KEY_CLIENT_ID = 'ncloudlab_google_client_id';
// Default demo placeholder Client ID (can be overridden by the user in UI or localStorage)
export const DEFAULT_GOOGLE_CLIENT_ID = '1004128456424-demoexampleclientid.apps.googleusercontent.com';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  // Signals
  readonly currentUser = signal<GoogleUserProfile | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly clientId = signal<string>(this.getStoredClientId());
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isGsiScriptLoaded = signal<boolean>(false);

  // Modal control signals
  readonly isLoginModalOpen = signal<boolean>(false);
  readonly isProfileModalOpen = signal<boolean>(false);

  constructor() {
    this.initStorageListener();
    this.loadGoogleScript();
  }

  /**
   * Listen to storage events for cross-tab login/logout synchronization
   */
  private initStorageListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY_USER || event.key === 'oneportal_google_user') {
          const updatedUser = this.getStoredUser();
          this.currentUser.set(updatedUser);
          this.broadcastAuthChange(updatedUser);
        }
      });
    }
  }

  /**
   * Broadcast authentication state to any listening Micro-Frontends (Remote MFEs)
   */
  private broadcastAuthChange(user: GoogleUserProfile | null): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ncloudlab:auth-change', {
          detail: user,
          bubbles: true,
        })
      );
      // Legacy event for cross-compatibility
      window.dispatchEvent(
        new CustomEvent('oneportal:auth-change', {
          detail: user,
          bubbles: true,
        })
      );
    }
  }

  private getStoredUser(): GoogleUserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem('oneportal_google_user');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse stored user profile', e);
      return null;
    }
  }

  private getStoredClientId(): string {
    if (typeof window === 'undefined') return DEFAULT_GOOGLE_CLIENT_ID;
    return localStorage.getItem(STORAGE_KEY_CLIENT_ID) || DEFAULT_GOOGLE_CLIENT_ID;
  }

  /**
   * Dynamically loads the official Google Identity Services script
   */
  public loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      if (typeof google !== 'undefined' && google.accounts?.id) {
        this.isGsiScriptLoaded.set(true);
        resolve();
        return;
      }

      const existingScript = document.getElementById('google-jssdk');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.isGsiScriptLoaded.set(true);
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isGsiScriptLoaded.set(true);
        resolve();
      };
      script.onerror = () => {
        console.warn('Google Identity Services script failed to load (check network/blockers)');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Google Identity Services and render button in the target HTML element
   */
  public async renderGoogleSignInButton(
    containerElement: HTMLElement,
    options: { theme?: 'outline' | 'filled_blue' | 'filled_black'; size?: 'large' | 'medium' | 'small'; width?: number } = {}
  ): Promise<void> {
    await this.loadGoogleScript();

    if (typeof google === 'undefined' || !google.accounts?.id) {
      this.errorMessage.set('Không thể tải thư viện Google Identity Services.');
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: this.clientId(),
        callback: (response: any) => this.handleGoogleCredentialResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Clear container before rendering
      containerElement.innerHTML = '';

      google.accounts.id.renderButton(containerElement, {
        type: 'standard',
        shape: 'rectangular',
        theme: options.theme || 'outline',
        text: 'signin_with',
        size: options.size || 'large',
        logo_alignment: 'left',
        width: options.width || 280,
      });

      this.errorMessage.set(null);
    } catch (err: any) {
      console.error('Error rendering Google Sign-In button', err);
      this.errorMessage.set(err?.message || 'Lỗi khởi tạo nút đăng nhập Google.');
    }
  }

  /**
   * Prompt Google One Tap sign-in
   */
  public promptOneTap(): void {
    if (typeof google !== 'undefined' && google.accounts?.id && !this.isAuthenticated()) {
      try {
        google.accounts.id.initialize({
          client_id: this.clientId(),
          callback: (response: any) => this.handleGoogleCredentialResponse(response),
        });
        google.accounts.id.prompt();
      } catch (err) {
        console.warn('One Tap prompt ignored or failed', err);
      }
    }
  }

  /**
   * Handle credential response from Google Identity Services
   */
  public handleGoogleCredentialResponse(response: { credential?: string }): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      if (!response.credential) {
        throw new Error('Không nhận được token xác thực từ Google.');
      }

      const payload = this.decodeJwt(response.credential);
      if (!payload || !payload.sub) {
        throw new Error('Dữ liệu xác thực không hợp lệ.');
      }

      const userProfile: GoogleUserProfile = {
        sub: payload.sub,
        name: payload.name || 'Người dùng Google',
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        email: payload.email,
        email_verified: payload.email_verified,
        idToken: response.credential,
        loginTime: Date.now(),
        authProvider: 'google',
      };

      this.setUserSession(userProfile);
      this.isLoginModalOpen.set(false);
    } catch (err: any) {
      console.error('Lỗi giải mã token Google', err);
      this.errorMessage.set(err?.message || 'Đăng nhập Google không thành công.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Demo / Fallback login for testing when Google Cloud Client ID is not yet provisioned
   */
  public loginWithDemoAccount(customProfile?: Partial<GoogleUserProfile>): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    setTimeout(() => {
      const demoUser: GoogleUserProfile = {
        sub: 'demo-google-uid-108293712849',
        name: customProfile?.name || 'Anh Nhiên (Demo Google)',
        given_name: customProfile?.given_name || 'Nhiên',
        family_name: customProfile?.family_name || 'Anh',
        picture:
          customProfile?.picture ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        email: customProfile?.email || 'nhien.nguyen.cloud@gmail.com',
        email_verified: true,
        idToken: 'demo_google_jwt_token_sample_header.eyJzdWIiOiIxMDgyOTM3MTI4NDkiLCJlbWFpbCI6ImFuLm5ndXllbi5jbG91ZEBnbWFpbC5jb20iLCJuYW1lIjoiTmd1eeG7h24gVsSDbiBBbiJ9.mock_signature',
        loginTime: Date.now(),
        authProvider: 'demo',
      };

      this.setUserSession(demoUser);
      this.isLoading.set(false);
      this.isLoginModalOpen.set(false);
    }, 400);
  }

  /**
   * Save user session to state and localStorage
   */
  private setUserSession(user: GoogleUserProfile): void {
    this.currentUser.set(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
    this.broadcastAuthChange(user);
  }

  /**
   * Log out of current Google session
   */
  public logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_USER);
    }

    if (typeof google !== 'undefined' && google.accounts?.id) {
      try {
        google.accounts.id.disableAutoSelect();
      } catch (err) {
        console.warn('Disable auto select failed', err);
      }
    }

    this.currentUser.set(null);
    this.isProfileModalOpen.set(false);
    this.broadcastAuthChange(null);
  }

  /**
   * Update and persist the Google OAuth Client ID
   */
  public updateClientId(newClientId: string): void {
    const cleanId = newClientId.trim();
    if (!cleanId) return;

    this.clientId.set(cleanId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CLIENT_ID, cleanId);
    }
  }

  /**
   * Decode Base64URL JWT payload with UTF-8 Unicode decoding
   */
  public decodeJwt(token: string): GoogleJwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as GoogleJwtPayload;
    } catch (e) {
      console.error('Error decoding JWT payload', e);
      return null;
    }
  }

  // Modal togglers
  public openLoginModal(): void {
    this.isLoginModalOpen.set(true);
    this.errorMessage.set(null);
  }

  public closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  public openProfileModal(): void {
    this.isProfileModalOpen.set(true);
  }

  public closeProfileModal(): void {
    this.isProfileModalOpen.set(false);
  }
}
