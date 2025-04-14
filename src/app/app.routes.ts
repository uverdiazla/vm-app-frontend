import { Routes } from '@angular/router';
import { VmListComponent } from './modules/virtual-machines/vm-list/vm-list.component';
import { VmDetailsComponent } from './modules/virtual-machines/vm-details/vm-details.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'virtual-machines', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: LayoutComponent,
    children: [
      { 
        path: 'virtual-machines', 
        component: VmListComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'virtual-machines/:id', 
        component: VmDetailsComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'virtual-machines' }
];
