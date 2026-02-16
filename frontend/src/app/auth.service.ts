import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly API_URL = 'http://localhost:3000/api/auth';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Check if token exists in localStorage
    this.isAuthenticated = !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.isAuthenticated = true;
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      })
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, {
      username,
      email,
      password
    }).pipe(
      tap(response => {
        this.isAuthenticated = true;
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  forgotPassword(email: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/forgot-password`, {
      email
    });
  }

  verifyResetToken(token: string): Observable<{message: string, valid: boolean}> {
    return this.http.get<{message: string, valid: boolean}>(`${this.API_URL}/verify-reset-token/${token}`);
  }

  resetPassword(token: string, newPassword: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/reset-password`, {
      token,
      newPassword
    });
  }
}
