import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userRole: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.updateUserInfo();
  }

  updateUserInfo(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userName = user.name;
      this.userRole = user.role;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  translateKey(key: string): string {
    return this.translate.instant(key);
  }
} 