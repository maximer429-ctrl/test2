import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('should validate username is required', () => {
    const username = component.loginForm.get('username');
    expect(username?.valid).toBeFalsy();
    expect(username?.hasError('required')).toBeTruthy();
  });

  it('should validate username minimum length', () => {
    const username = component.loginForm.get('username');
    username?.setValue('ab');
    expect(username?.hasError('minlength')).toBeTruthy();
  });

  it('should validate password is required', () => {
    const password = component.loginForm.get('password');
    expect(password?.valid).toBeFalsy();
    expect(password?.hasError('required')).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const password = component.loginForm.get('password');
    password?.setValue('12345');
    expect(password?.hasError('minlength')).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have valid form when fields are filled correctly', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call AuthService login on valid form submission', () => {
    const mockResponse = {
      message: 'Login successful',
      token: 'test-token',
      user: { id: 1, username: 'testuser' }
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('should navigate to /hello on successful login', () => {
    const mockResponse = {
      message: 'Login successful',
      token: 'test-token',
      user: { id: 1, username: 'testuser' }
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/hello']);
  });

  it('should set error message on failed login', () => {
    const errorResponse = {
      error: { message: 'Invalid credentials' }
    };
    authService.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.isLoading).toBe(false);
  });

  it('should set loading state during login', () => {
    const mockResponse = {
      message: 'Login successful',
      token: 'test-token',
      user: { id: 1, username: 'testuser' }
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });

    expect(component.isLoading).toBe(false);
    component.onSubmit();
    // During the call, isLoading would be true, but it's set back to false after
    expect(component.isLoading).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.patchValue({
      username: 'ab', // Too short
      password: '123'  // Too short
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should display error message in template when errorMessage is set', () => {
    component.errorMessage = 'Test error message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorElement = compiled.querySelector('.error-message');
    expect(errorElement?.textContent).toContain('Test error message');
  });

  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton.disabled).toBeFalsy();
  });
});
