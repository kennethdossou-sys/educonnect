import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set } from 'firebase/database';
import { QuizResult } from '../../shared/models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private db = getDatabase();

  async getResultatsQuiz(uid: string): Promise<QuizResult[]> {
    const snapshot = await get(ref(this.db, `quizResults/${uid}`));
    if (!snapshot.exists()) return [];
    return Object.values(
      snapshot.val() as Record<string, QuizResult>
    );
  }

  async saveResultat(uid: string, resultat: QuizResult): Promise<void> {
    await set(
      ref(this.db, `quizResults/${uid}/${resultat.id}`),
      resultat
    );
  }

  async getQuizByCourse(courseId: string): Promise<any> {
    const snapshot = await get(ref(this.db, `quizzes/${courseId}`));
    if (!snapshot.exists()) return null;
    const data = snapshot.val();
    return {
      ...data,
      questions: data.questions
        ? Object.values(data.questions)
        : []
    };
  }
}