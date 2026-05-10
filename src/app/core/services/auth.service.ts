import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  private db = getDatabase();

  constructor(private router: Router) {}

  async login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(
      this.auth, email, password
    );
    const userData = await this.getUserData(result.user.uid);
    if (userData?.role === 'enseignant') {
      await this.router.navigate(['/teacher/dashboard']);
    } else {
      await this.router.navigate(['/student/home']);
    }
    return result;
  }

  async register(
    email: string,
    password: string,
    nom: string,
    prenom: string,
    role: 'etudiant' | 'enseignant'
  ) {
    const result = await createUserWithEmailAndPassword(
      this.auth, email, password
    );
    await set(ref(this.db, 'users/' + result.user.uid), {
      uid: result.user.uid,
      email,
      nom,
      prenom,
      role
    });
    return result;
  }

  async getUserData(uid: string): Promise<User | null> {
    const snapshot = await get(ref(this.db, 'users/' + uid));
    if (snapshot.exists()) {
      return snapshot.val() as User;
    }
    return null;
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/auth/login']);
  }

  async resetPassword(email: string): Promise<void> {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

  getCurrentUser() {
    return this.auth.currentUser;
  }
}