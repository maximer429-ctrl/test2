import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isValidToken: boolean = false;
  isCheckingToken: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get token from URL query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.verifyToken();
      } else {
        this.message = 'Invalid reset link. Please request a new password reset.';
        this.isCheckingToken = false;
      }
    });
  }

  verifyToken(): void {
    this.authService.verifyResetToken(this.token).subscribe({
      next: (response) => {
        this.isValidToken = response.valid;
        this.isCheckingToken = false;
        if (!response.valid) {
          this.message = 'This reset link has expired or is invalid. Please request a new password reset.';
        }
      },
      error: (error) => {
        this.isValidToken = false;
        this.isCheckingToken = false;
        this.message = error.error?.message || 'Invalid or expired reset link.';
      }
    });
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.message = 'Please fill in all fields';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword.length < 6) {
      this.message = 'Password must be at least 6 characters';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isSuccess = true;
        this.isLoading = false;
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.message = error.error?.message || 'An error occurred. Please try again.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}
