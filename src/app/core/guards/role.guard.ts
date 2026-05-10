import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { getApp } from 'firebase/app';

export const studentGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = getAuth();

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.navigate(['/auth/login']);
        resolve(false);
        return;
      }
      const db = getDatabase(getApp());
      const snapshot = await get(ref(db, `users/${user.uid}`));
      if (snapshot.exists() && snapshot.val().role === 'etudiant') {
        resolve(true);
      } else {
        router.navigate(['/auth/login']);
        resolve(false);
      }
    });
  });
};

export const teacherGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = getAuth();

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.navigate(['/auth/login']);
        resolve(false);
        return;
      }
      const db = getDatabase(getApp());
      const snapshot = await get(ref(db, `users/${user.uid}`));
      if (snapshot.exists() && snapshot.val().role === 'enseignant') {
        resolve(true);
      } else {
        router.navigate(['/auth/login']);
        resolve(false);
      }
    });
  });
};

