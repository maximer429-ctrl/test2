import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) {
    // Check if token exists in localStorage
    this.isAuthenticated = !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): boolean {
    // Temporary: accept any non-empty credentials
    // Will be replaced with API call in backend integration
    if (username && password) {
      this.isAuthenticated = true;
      localStorage.setItem(this.TOKEN_KEY, 'temp_token');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
