
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';
import { NotificationService } from './notification.service';

const MOCK_USERS: User[] = [
  // Super Admin
  { id: 1, username: 'superadmin555', password: 'superadmin555', name: 'Super Administrador', department: 'General', role: 'SUPER_ADMIN' },
  // Admins
  { id: 2, username: 'telematica555', password: 'telematica555', name: 'Admin Telemática', department: 'Telemática', role: 'ADMIN' },
  { id: 3, username: 'ingenieria777', password: 'ingenieria777', name: 'Admin Ingeniería', department: 'Ingeniería', role: 'ADMIN' },
  { id: 4, username: 'equiposmedico333', password: 'equiposmedico333', name: 'Admin Equipos Médicos', department: 'Equipos Médicos', role: 'ADMIN' },
  // Regular Users
  { id: 5, username: 'rodolfo', password: 'password123', name: 'Rodolfo Perez', department: 'Telemática', role: 'USER' },
  { id: 6, username: 'ana', password: 'password123', name: 'Ana Gomez', department: 'Ingeniería', role: 'USER' },
  { id: 7, username: 'carlos', password: 'password123', name: 'Carlos Diaz', department: 'Equipos Médicos', role: 'USER' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private _users = signal<User[]>(MOCK_USERS);
  
  // Public signals
  users = this._users.asReadonly();
  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());
  
  constructor() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(username: string, password: string):boolean {
    const user = this._users().find(u => u.username === username && u.password === password);
    if (user) {
      const { password, ...userToStore } = user;
      this.currentUser.set(userToStore as User);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));

      // Navigate based on role
      switch(user.role) {
        case 'SUPER_ADMIN':
          this.router.navigate(['/super-admin-dashboard']);
          break;
        case 'ADMIN':
          this.router.navigate(['/admin-dashboard']);
          break;
        case 'USER':
          this.router.navigate(['/user-dashboard']);
          break;
        default:
          this.router.navigate(['/login']);
          break;
      }
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.notificationService.show('Sesión finalizada con éxito', 'success');
  }
  
  createUser(user: Omit<User, 'id'>) {
    const newUser = { ...user, id: Date.now() };
    this._users.update(users => [...users, newUser]);
    this.notificationService.show('Usuario Creado', 'success');
  }

  updateUser(updatedUser: User) {
    this._users.update(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
    this.notificationService.show('Usuario Editado con éxito', 'success');
  }

  getUserById(id: number): User | undefined {
    return this._users().find(u => u.id === id);
  }
}
