import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'hello', component: HelloWorldComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
