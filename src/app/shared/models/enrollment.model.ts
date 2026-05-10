export interface Enrollment {
  id: string;
  titre: string;
  progression: number;
  score: number;
  statut: 'en_cours' | 'termine';
}

export interface QuizResult {
  id: string;
  titre: string;
  score: number;
  date: string;
}