
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationType } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  message = input.required<string>();
  type = input.required<NotificationType>();

  get baseClasses() {
    return 'fixed top-5 right-5 z-[100] px-6 py-4 rounded-lg shadow-lg text-white animate-fade-in-out';
  }

  get typeClasses() {
    switch (this.type()) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
      default:
        return 'bg-light-blue-500';
    }
  }
}
