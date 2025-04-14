import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      console.log('User already logged in, redirecting to virtual-machines');
      this.router.navigate(['/virtual-machines']);
      return;
    }
    
    // Create login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    // Return if form is invalid
    if (this.loginForm.invalid) {
      console.log('Form is invalid', this.loginForm.errors);
      return;
    }
    
    this.isLoading = true;
    console.log('Attempting login with:', this.loginForm.value.email);
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful, received token:', response.token ? 'Yes' : 'No');
        this.isLoading = false;
        this.notificationService.success('auth.loginSuccess');
        console.log('Redirecting to virtual-machines');
        this.router.navigate(['/virtual-machines']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        this.notificationService.error('auth.invalidCredentials');
      }
    });
  }

  // Helper methods for template
  get email() { 
    return this.loginForm.get('email'); 
  }
  
  get password() { 
    return this.loginForm.get('password'); 
  }
  
  // Translate helper
  translate(key: string): string {
    return this.i18nService.translate(key);
  }
} 