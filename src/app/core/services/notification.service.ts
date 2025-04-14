import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from './i18n.service';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(
    private snackBar: MatSnackBar,
    private i18nService: I18nService
  ) { }

  /**
   * Show a notification message
   * @param message The message to show (can be a translation key)
   * @param type The type of notification
   * @param duration The duration in milliseconds
   */
  show(message: string, type: NotificationType = 'info', duration: number = 3000): void {
    // Try to translate message if it's a key
    const translatedMessage = this.i18nService.translate(message);
    
    // Configure panelClass based on notification type
    const panelClass = `notification-${type}`;
    
    this.snackBar.open(translatedMessage, 'X', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  /**
   * Show a success notification
   */
  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error notification
   */
  error(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration: number = 4000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Show an info notification
   */
  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }
} 