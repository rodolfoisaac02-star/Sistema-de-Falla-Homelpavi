
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  username = signal('');
  password = signal('');
  error = signal<string | null>(null);

  onSubmit() {
    if (this.authService.login(this.username(), this.password())) {
      this.error.set(null);
    } else {
      this.error.set('Usuario o contraseña incorrectos.');
    }
  }
}
