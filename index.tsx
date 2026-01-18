
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './src/app.component';
import { LoginComponent } from './src/components/login/login.component';
import { UserDashboardComponent } from './src/components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './src/components/admin-dashboard/admin-dashboard.component';
import { SuperAdminDashboardComponent } from './src/components/super-admin-dashboard/super-admin-dashboard.component';
import { authGuard } from './src/guards/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { 
        path: 'user-dashboard', 
        component: UserDashboardComponent,
        canActivate: [() => authGuard(['USER', 'ADMIN', 'SUPER_ADMIN'])]
      },
      { 
        path: 'admin-dashboard', 
        component: AdminDashboardComponent,
        canActivate: [() => authGuard(['ADMIN', 'SUPER_ADMIN'])]
      },
      { 
        path: 'super-admin-dashboard', 
        component: SuperAdminDashboardComponent,
        canActivate: [() => authGuard(['SUPER_ADMIN'])]
      },
      { path: '**', redirectTo: 'login' }
    ], withHashLocation())
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
