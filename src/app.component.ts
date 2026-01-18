
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, CommonModule, NotificationComponent, AsyncPipe]
})
export class AppComponent {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  currentUser = this.authService.currentUser;
  notification = this.notificationService.notification;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
