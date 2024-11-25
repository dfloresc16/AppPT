import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('access_token'); // Valida el token en localStorage

  if (!token) {
    // Si no está autenticado, guarda la URL y redirige a login
    sessionStorage.setItem('url', state.url);
    console.log('Acceso denegado. Redirigiendo a /auth/login');
    router.navigate(['/auth/login']);
    return false;
  }

  console.log('Usuario autenticado');
  return true;
};
