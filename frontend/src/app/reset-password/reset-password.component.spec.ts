import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../auth.service';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['verifyResetToken', 'resetPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      queryParams: of({ token: 'test-token' })
    };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and verify token from query params', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    
    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.token).toBe('test-token');
    expect(authService.verifyResetToken).toHaveBeenCalledWith('test-token');
  });

  it('should set isValidToken to true when token is valid', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    
    fixture.detectChanges();

    expect(component.isValidToken).toBe(true);
    expect(component.isCheckingToken).toBe(false);
  });

  it('should set isValidToken to false when token is invalid', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Invalid token', valid: false }));
    
    fixture.detectChanges();

    expect(component.isValidToken).toBe(false);
    expect(component.message).toContain('expired or is invalid');
  });

  it('should show error when no token in query params', () => {
    activatedRoute.queryParams = of({});
    
    fixture.detectChanges();

    expect(component.message).toContain('Invalid reset link');
    expect(component.isCheckingToken).toBe(false);
  });

  it('should show error when passwords do not match', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    fixture.detectChanges();

    component.newPassword = 'password123';
    component.confirmPassword = 'different';
    component.onSubmit();

    expect(component.message).toBe('Passwords do not match');
    expect(component.isSuccess).toBe(false);
  });

  it('should show error when password is too short', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    fixture.detectChanges();

    component.newPassword = '12345';
    component.confirmPassword = '12345';
    component.onSubmit();

    expect(component.message).toBe('Password must be at least 6 characters');
    expect(component.isSuccess).toBe(false);
  });

  it('should show error when fields are empty', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    fixture.detectChanges();

    component.newPassword = '';
    component.confirmPassword = '';
    component.onSubmit();

    expect(component.message).toBe('Please fill in all fields');
    expect(component.isSuccess).toBe(false);
  });

  it('should call AuthService resetPassword on valid submission', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    const mockResponse = { message: 'Password reset successful' };
    authService.resetPassword.and.returnValue(of(mockResponse));
    
    fixture.detectChanges();

    component.newPassword = 'newpassword123';
    component.confirmPassword = 'newpassword123';
    component.onSubmit();

    expect(authService.resetPassword).toHaveBeenCalledWith('test-token', 'newpassword123');
  });

  it('should display success message and redirect after successful reset', (done) => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    const mockResponse = { message: 'Password reset successful' };
    authService.resetPassword.and.returnValue(of(mockResponse));
    
    fixture.detectChanges();

    component.newPassword = 'newpassword123';
    component.confirmPassword = 'newpassword123';
    component.onSubmit();

    expect(component.message).toBe(mockResponse.message);
    expect(component.isSuccess).toBe(true);
    expect(component.isLoading).toBe(false);

    // Check that redirect is scheduled
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    }, 3100);
  });

  it('should display error message on failed reset', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    const errorResponse = {
      error: { message: 'Token expired' }
    };
    authService.resetPassword.and.returnValue(throwError(() => errorResponse));
    
    fixture.detectChanges();

    component.newPassword = 'newpassword123';
    component.confirmPassword = 'newpassword123';
    component.onSubmit();

    expect(component.message).toBe('Token expired');
    expect(component.isSuccess).toBe(false);
    expect(component.isLoading).toBe(false);
  });

  it('should render form when token is valid', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const passwordInputs = compiled.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBe(2);
  });

  it('should show loading message while verifying token', () => {
    authService.verifyResetToken.and.returnValue(of({ message: 'Token is valid', valid: true }));
    component.isCheckingToken = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Verifying');
  });
});
