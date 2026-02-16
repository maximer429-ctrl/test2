import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) {
      this.message = 'Please enter your email address';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isSuccess = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.message = error.error?.message || 'An error occurred. Please try again.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}
