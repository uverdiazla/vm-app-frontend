import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private languageSubject = new BehaviorSubject<Language>('es');
  
  constructor() {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      this.languageSubject.next(savedLanguage);
    }
  }
  
  get language(): Observable<Language> {
    return this.languageSubject.asObservable();
  }
  
  get currentLanguage(): Language {
    return this.languageSubject.value;
  }
  
  setLanguage(language: Language): void {
    localStorage.setItem('language', language);
    this.languageSubject.next(language);
  }
  
  toggleLanguage(): void {
    const newLanguage = this.languageSubject.value === 'es' ? 'en' : 'es';
    this.setLanguage(newLanguage);
  }
} 