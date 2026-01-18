
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models';

export const authGuard = (allowedRoles: Role[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUser();

  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
