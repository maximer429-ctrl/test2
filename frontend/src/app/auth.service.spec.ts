import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  const API_URL = 'http://localhost:3000/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    // Note: Login requires users to exist in the database.
    // Non-existent users will receive 401 "Invalid credentials" (no auto-creation).
    
    it('should login successfully and store token', () => {
      const mockResponse = {
        message: 'Login successful',
        token: 'test-token',
        user: { id: 1, username: 'testuser' }
      };

      service.login('testuser', 'password123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('auth_token')).toBe('test-token');
        expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockResponse.user));
        expect(service.isLoggedIn()).toBe(true);
      });

      const req = httpMock.expectOne(`${API_URL}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });
      req.flush(mockResponse);
    });

    it('should handle login error for wrong password', () => {
      service.login('testuser', 'wrongpassword').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(service.isLoggedIn()).toBe(false);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle login error for non-existent user', () => {
      service.login('nonexistentuser', 'password123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error.message).toBe('Invalid credentials');
          expect(service.isLoggedIn()).toBe(false);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register successfully and store token', () => {
      const mockResponse = {
        message: 'Registration successful',
        token: 'test-token',
        user: { id: 1, username: 'newuser', email: 'test@example.com' }
      };

      service.register('newuser', 'test@example.com', 'password123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('auth_token')).toBe('test-token');
        expect(service.isLoggedIn()).toBe(true);
      });

      const req = httpMock.expectOne(`${API_URL}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username: 'newuser',
        email: 'test@example.com',
        password: 'password123'
      });
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear localStorage and navigate to login', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1, username: 'testuser' }));

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'test-token');
      const newService = new AuthService(router, TestBed.inject(HttpClientTestingModule) as any);
      expect(newService.isLoggedIn()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getUser', () => {
    it('should return user from localStorage', () => {
      const user = { id: 1, username: 'testuser' };
      localStorage.setItem('auth_user', JSON.stringify(user));
      expect(service.getUser()).toEqual(user);
    });

    it('should return null when no user in localStorage', () => {
      expect(service.getUser()).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', () => {
      const mockResponse = { message: 'Reset link sent' };

      service.forgotPassword('test@example.com').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@example.com' });
      req.flush(mockResponse);
    });
  });

  describe('verifyResetToken', () => {
    it('should verify reset token', () => {
      const mockResponse = { message: 'Token is valid', valid: true };
      const token = 'test-token';

      service.verifyResetToken(token).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/verify-reset-token/${token}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', () => {
      const mockResponse = { message: 'Password reset successful' };
      const token = 'test-token';
      const newPassword = 'newpassword123';

      service.resetPassword(token, newPassword).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token, newPassword });
      req.flush(mockResponse);
    });
  });
});
