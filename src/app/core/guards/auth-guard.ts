import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = getAuth();

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/auth/login']);
        resolve(false);
      }
    });
  });
};