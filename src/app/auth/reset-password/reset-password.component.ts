import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  isTokenValid = false;
  hideNew = true;
  hideConfirm = true;

  changeForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    // Capture the token from the URL query string
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('Received token:', this.token);
    });
  }
  onSubmit() {
    const { newPassword, confirmPassword } =
      this.changeForm.value;

    if (newPassword !== confirmPassword) {
      Swal.fire('Error', 'New passwords do not match', 'error');
      return;
    }

    this.authService.resetPassword(this.token, newPassword!).subscribe({
      next: () => {
        Swal.fire('Success', 'Password changed successfully', 'success').then(
          () => {
            this.router.navigate(['/signin']);
          }
        );
      },
      error: (err) => {
        Swal.fire(
          'Failed',
          err.error?.message || 'Password change failed',
          'error'
        );
      },
    });
  }
}

