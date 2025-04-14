import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private translateService: TranslateService) {
    // Inicializar idiomas
    this.translateService.addLangs(['es', 'en']);
    // Idioma por defecto
    this.translateService.setDefaultLang('es');
    // Establecer idioma actual
    this.translateService.use('es');
  }

  /**
   * Traduce una clave
   * @param key Clave a traducir
   * @param params Parámetros de traducción
   * @returns Cadena traducida
   */
  translate(key: string, params: any = {}): string {
    if (!key) return '';
    
    let translation = '';
    // El método instant es síncrono
    this.translateService.get(key, params).subscribe(value => {
      translation = value;
    });
    
    return translation || key;
  }

  /**
   * Cambia el idioma
   * @param lang Código del idioma
   */
  setLanguage(lang: string): void {
    if (this.translateService.getLangs().includes(lang)) {
      this.translateService.use(lang);
    }
  }

  /**
   * Devuelve el idioma actual
   * @returns Código del idioma
   */
  getCurrentLanguage(): string {
    return this.translateService.currentLang;
  }
} 