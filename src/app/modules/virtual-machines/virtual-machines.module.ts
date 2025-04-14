import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { VmListComponent } from './vm-list/vm-list.component';
import { VmDetailsComponent } from './vm-details/vm-details.component';
import { VmDialogComponent } from './vm-dialog/vm-dialog.component';
import { SignalrDebugComponent } from '../../shared/components/signalr-debug/signalr-debug.component';

const routes: Routes = [
  {
    path: '',
    component: VmListComponent
  },
  {
    path: ':id',
    component: VmDetailsComponent
  }
];

@NgModule({
  declarations: [
    VmListComponent,
    VmDetailsComponent,
    VmDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    TranslateModule,
    SignalrDebugComponent
  ]
})
export class VirtualMachinesModule { } 