export interface Assignment {
  id: string;
  courseId: string;
  etudiantId: string;
  titre: string;
  instructions: string;
  dateLimit: Date;
  fichierUrl?: string;
  statut: 'a_rendre' | 'soumis' | 'corrige';
  note?: number;
}

export interface AssignmentTemplate {
  id: string;
  titre: string;
  instructions: string;
  dateLimit: string;
}