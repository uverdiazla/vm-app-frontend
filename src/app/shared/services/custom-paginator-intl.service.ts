import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  
  private _translate: TranslateService;
  
  constructor(private translate: TranslateService) {
    super();
    this._translate = translate;
    
    // Force Spanish locale on initialization
    if (this._translate.currentLang !== 'es') {
      this._translate.use('es');
    }
    
    this.initTranslations();

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(() => {
      this.initTranslations();
      this.changes.next();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this._translate.instant('paginator.emptyRange');
    }
    
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? 
      Math.min(startIndex + pageSize, length) : 
      startIndex + pageSize;
    
    return this._translate.instant('paginator.range', {
      startIndex: startIndex + 1,
      endIndex,
      length
    });
  };

  private initTranslations(): void {
    this.itemsPerPageLabel = this._translate.instant('paginator.itemsPerPage');
    this.nextPageLabel = this._translate.instant('paginator.nextPage');
    this.previousPageLabel = this._translate.instant('paginator.previousPage');
    this.firstPageLabel = this._translate.instant('paginator.firstPage');
    this.lastPageLabel = this._translate.instant('paginator.lastPage');
  }
} 