import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn && this.authService.isAdmin) {
      return true;
    }
    
    // If already logged in but not admin, redirect to dashboard
    if (this.authService.isLoggedIn) {
      return this.router.createUrlTree(['/dashboard']);
    }
    
    // Otherwise redirect to login
    return this.router.createUrlTree(['/login']);
  }
} 