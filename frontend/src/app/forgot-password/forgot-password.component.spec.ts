import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../auth.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty email', () => {
    expect(component.email).toBe('');
    expect(component.message).toBe('');
    expect(component.isLoading).toBe(false);
    expect(component.isSuccess).toBe(false);
  });

  it('should show error when email is empty', () => {
    component.email = '';
    component.onSubmit();

    expect(component.message).toBe('Please enter your email address');
    expect(component.isSuccess).toBe(false);
    expect(authService.forgotPassword).not.toHaveBeenCalled();
  });

  it('should call AuthService forgotPassword on valid submission', () => {
    const mockResponse = { message: 'Reset link sent' };
    authService.forgotPassword.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.onSubmit();

    expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('should display success message on successful request', () => {
    const mockResponse = { message: 'If an account exists with this email, a password reset link has been sent' };
    authService.forgotPassword.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.onSubmit();

    expect(component.message).toBe(mockResponse.message);
    expect(component.isSuccess).toBe(true);
    expect(component.isLoading).toBe(false);
  });

  it('should display error message on failed request', () => {
    const errorResponse = {
      error: { message: 'An error occurred' }
    };
    authService.forgotPassword.and.returnValue(throwError(() => errorResponse));

    component.email = 'test@example.com';
    component.onSubmit();

    expect(component.message).toBe('An error occurred');
    expect(component.isSuccess).toBe(false);
    expect(component.isLoading).toBe(false);
  });

  it('should set loading state during request', () => {
    const mockResponse = { message: 'Reset link sent' };
    authService.forgotPassword.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    expect(component.isLoading).toBe(false);

    component.onSubmit();

    expect(component.isLoading).toBe(false); // It's set back to false after completion
  });

  it('should render form with email input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const emailInput = compiled.querySelector('input[type="email"]');
    expect(emailInput).toBeTruthy();
  });

  it('should have submit button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  it('should display message when set', () => {
    component.message = 'Test message';
    component.isSuccess = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('.message');
    expect(messageElement?.textContent).toContain('Test message');
  });
});
