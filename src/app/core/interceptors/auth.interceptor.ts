import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only try to get token from localStorage if we're in a browser
    if (isPlatformBrowser(this.platformId)) {
      // Get the token from localStorage
      const token = localStorage.getItem('token');

      // Check if token exists and add it to the request headers
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    // Continue with the modified request
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors (expired token or invalid credentials)
        if (error.status === 401) {
          if (isPlatformBrowser(this.platformId)) {
            // Clear local storage only if in browser
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          
          // Redirect to login page
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
} 