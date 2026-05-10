import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set } from 'firebase/database';
import { Enrollment, QuizResult } from '../../shared/models/enrollment.model';
import { Assignment } from '../../shared/models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private db = getDatabase();

  async getCoursesInProgress(uid: string): Promise<Enrollment[]> {
    const snapshot = await get(ref(this.db, `enrollments/${uid}`));
    if (!snapshot.exists()) return [];
    const data = snapshot.val() as Record<string, Enrollment>;
    return Object.values(data).filter(c => c.statut === 'en_cours');
  }

  async getCoursesFinishes(uid: string): Promise<Enrollment[]> {
    const snapshot = await get(ref(this.db, `enrollments/${uid}`));
    if (!snapshot.exists()) return [];
    const data = snapshot.val() as Record<string, Enrollment>;
    return Object.values(data).filter(c => c.statut === 'termine');
  }

  async enrollCourse(uid: string, enrollment: Enrollment): Promise<void> {
    await set(
      ref(this.db, `enrollments/${uid}/${enrollment.id}`),
      enrollment
    );
  }

  async getDevoirsARendre(uid: string): Promise<Assignment[]> {
    const snapshot = await get(ref(this.db, `assignments/${uid}`));
    if (!snapshot.exists()) return [];
    const data = snapshot.val() as Record<string, Assignment>;
    return Object.values(data).filter(d => d.statut === 'a_rendre');
  }

  async submitDevoir(uid: string, devoir: Assignment): Promise<void> {
    await set(
      ref(this.db, `assignments/${uid}/${devoir.id}`),
      { ...devoir, statut: 'soumis' }
    );
  }
}