import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CustomPaginatorIntl } from './services/custom-paginator-intl.service';

@NgModule({
  declarations: [
    NavbarComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NavbarComponent,
    LayoutComponent
  ],
  providers: [
    CustomPaginatorIntl
  ]
})
export class SharedModule { } 