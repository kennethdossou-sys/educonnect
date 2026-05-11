import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getApp } from 'firebase/app';
import { AuthService } from '../../../core/services/auth.service';
import { Chapitre } from '../../../shared/models/course.model';
import { Question } from '../../../shared/models/quiz.model';
import { AssignmentTemplate } from '../../../shared/models/assignment.model';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  courseId = '';
  titre = '';
  description = '';
  categorie = '';
  niveau = '';
  duree = '';
  chapitres: Chapitre[] = [];
  questions: Question[] = [];
  devoirs: AssignmentTemplate[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  categories = ['Programmation', 'Design', 'Data Science', 'DevOps', 'Marketing', 'Autres'];
  niveaux = ['Débutant', 'Intermédiaire', 'Avancé'];

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.courseId) {
      this.loadCourse();
    }
  }

  async loadCourse() {
    try {
      const db = getDatabase(getApp());

      // Charger les infos du cours
      const courseSnap = await get(ref(db, `courses/${this.courseId}`));
      if (courseSnap.exists()) {
        const data = courseSnap.val();
        this.titre = data.titre || '';
        this.description = data.description || '';
        this.categorie = data.categorie || '';
        this.niveau = data.niveau || '';
        this.duree = data.duree || '';
        this.chapitres = data.chapitres ? Object.values(data.chapitres) : [];
      }

      // Charger le quiz
      const quizSnap = await get(ref(db, `quizzes/${this.courseId}`));
      if (quizSnap.exists()) {
        const quizData = quizSnap.val();
        this.questions = quizData.questions
          ? Object.values(quizData.questions)
          : [];
      }

      // Charger les devoirs
      const devoirSnap = await get(ref(db, `courseAssignments/${this.courseId}`));
      if (devoirSnap.exists()) {
        const devoirData = devoirSnap.val();
        this.devoirs = devoirData.devoirs || [];
      }

    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  addChapitre() {
    this.chapitres.push({
      id: Date.now().toString(),
      titre: '',
      duree: '',
      videoUrl: ''
    });
  }

  removeChapitre(index: number) {
    this.chapitres.splice(index, 1);
  }

  addQuestion() {
    this.questions.push({
      id: Date.now().toString(),
      texte: '',
      choix: ['', '', '', ''],
      bonneReponse: 0
    });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addDevoir() {
    this.devoirs.push({
      id: Date.now().toString(),
      titre: '',
      instructions: '',
      dateLimit: ''
    });
  }

  removeDevoir(index: number) {
    this.devoirs.splice(index, 1);
  }

  async onSubmit() {
    if (!this.titre || !this.description || !this.categorie) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const db = getDatabase(getApp());
      const user = this.authService.getCurrentUser();
      const userData = await this.authService.getUserData(user!.uid);

      // Mettre à jour le cours
      await set(ref(db, `courses/${this.courseId}`), {
        id: this.courseId,
        titre: this.titre,
        description: this.description,
        categorie: this.categorie,
        niveau: this.niveau,
        duree: this.duree,
        note: 0,
        enseignant: `${userData?.prenom} ${userData?.nom}`,
        enseignantId: user!.uid,
        chapitres: this.chapitres.reduce((acc: any, ch, i) => {
          acc[`ch${i}`] = ch;
          return acc;
        }, {})
      });

      // Mettre à jour le quiz
      if (this.questions.length > 0) {
        await set(ref(db, `quizzes/${this.courseId}`), {
          id: this.courseId,
          courseId: this.courseId,
          questions: this.questions
        });
      }

      // Mettre à jour les devoirs
      if (this.devoirs.length > 0) {
        await set(ref(db, `courseAssignments/${this.courseId}`), {
          courseId: this.courseId,
          devoirs: this.devoirs
        });
      }

      this.router.navigate(['/teacher/dashboard']);

    } catch (error) {
      this.errorMessage = 'Erreur lors de la mise à jour. Réessayez.';
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }
}