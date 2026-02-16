import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.value).toEqual({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  });

  it('should validate username is required', () => {
    const username = component.registerForm.get('username');
    expect(username?.hasError('required')).toBeTruthy();
  });

  it('should validate username minimum length', () => {
    const username = component.registerForm.get('username');
    username?.setValue('ab');
    expect(username?.hasError('minlength')).toBeTruthy();
  });

  it('should validate email is required', () => {
    const email = component.registerForm.get('email');
    expect(email?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.registerForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.hasError('email')).toBeTruthy();
  });

  it('should validate password is required', () => {
    const password = component.registerForm.get('password');
    expect(password?.hasError('required')).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const password = component.registerForm.get('password');
    password?.setValue('12345');
    expect(password?.hasError('minlength')).toBeTruthy();
  });

  it('should validate confirm password is required', () => {
    const confirmPassword = component.registerForm.get('confirmPassword');
    expect(confirmPassword?.hasError('required')).toBeTruthy();
  });

  it('should have valid form when all fields are filled correctly', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should show error when passwords do not match', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Passwords do not match');
  });

  it('should call AuthService register on valid form submission', () => {
    const mockResponse = {
      message: 'Registration successful',
      token: 'test-token',
      user: { id: 1, username: 'testuser', email: 'test@example.com' }
    };
    authService.register.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
  });

  it('should navigate to /hello on successful registration', () => {
    const mockResponse = {
      message: 'Registration successful',
      token: 'test-token',
      user: { id: 1, username: 'testuser', email: 'test@example.com' }
    };
    authService.register.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/hello']);
  });

  it('should set error message on failed registration', () => {
    const errorResponse = {
      error: { message: 'Username already exists' }
    };
    authService.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.patchValue({
      username: 'existinguser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Username already exists');
    expect(component.isLoading).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.patchValue({
      username: 'ab',
      email: 'invalid',
      password: '123',
      confirmPassword: '123'
    });

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton.disabled).toBeTruthy();
  });
});
