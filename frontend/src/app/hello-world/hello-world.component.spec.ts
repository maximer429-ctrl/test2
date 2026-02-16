import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HelloWorldComponent } from './hello-world.component';
import { AuthService } from '../auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HelloWorldComponent', () => {
  let component: HelloWorldComponent;
  let fixture: ComponentFixture<HelloWorldComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HelloWorldComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(HelloWorldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome message', () => {
    authService.getUser.and.returnValue({ username: 'testuser' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    expect(heading?.textContent).toContain('Hello World');
  });

  it('should display username when user is logged in', () => {
    authService.getUser.and.returnValue({ id: 1, username: 'testuser' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('testuser');
  });

  it('should call logout when logout button is clicked', () => {
    authService.getUser.and.returnValue({ username: 'testuser' });
    fixture.detectChanges();

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
  });

  it('should have logout button in template', () => {
    authService.getUser.and.returnValue({ username: 'testuser' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const logoutButton = compiled.querySelector('button');
    expect(logoutButton).toBeTruthy();
    expect(logoutButton?.textContent).toContain('Logout');
  });

  it('should call logout method when logout button is clicked', () => {
    spyOn(component, 'logout');
    authService.getUser.and.returnValue({ username: 'testuser' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const logoutButton = compiled.querySelector('button') as HTMLButtonElement;
    logoutButton.click();

    expect(component.logout).toHaveBeenCalled();
  });

  it('should render message about protected route', () => {
    authService.getUser.and.returnValue({ username: 'testuser' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('protected');
  });
});
