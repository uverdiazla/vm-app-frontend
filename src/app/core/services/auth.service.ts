import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse, User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Load user and token from local storage on service initialization only if in browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromStorage();
    }
  }

  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserValue?.role === 'Admin';
  }

  /**
   * Gets the current JWT token
   * @returns The current JWT token or empty string if not available
   */
  getToken(): string {
    return this.tokenValue || '';
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.storeUserData(response);
        })
      );
  }

  logout(): void {
    // Clear user data from local storage only if in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    
    // Reset subjects
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  private storeUserData(response: LoginResponse): void {
    // Store token in local storage only if in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', response.token);
      
      // Create user object
      const user: User = {
        name: response.name,
        email: response.email,
        role: response.role
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Create user object for the subjects
    const user: User = {
      name: response.name,
      email: response.email,
      role: response.role
    };
    
    // Update subjects
    this.currentUserSubject.next(user);
    this.tokenSubject.next(response.token);
  }

  private loadUserFromStorage(): void {
    // Only execute if in browser
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userJson && token) {
        try {
          const user = JSON.parse(userJson) as User;
          this.currentUserSubject.next(user);
          this.tokenSubject.next(token);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
          this.logout();
        }
      }
    }
  }
} 