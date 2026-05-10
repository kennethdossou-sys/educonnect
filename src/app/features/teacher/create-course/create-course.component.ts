import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, Chapitre } from '../../../shared/models/course.model';
import { getDatabase, ref, set } from 'firebase/database';
import { getApp } from 'firebase/app';
import { Question } from '../../../shared/models/quiz.model';
import { AssignmentTemplate } from '../../../shared/models/assignment.model';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent {
  titre = '';
  description = '';
  categorie = '';
  niveau = '';
  duree = '';
  chapitres: Chapitre[] = [];
  questions: Question[] = [];
  isSubmitting = false;
  errorMessage = '';

  categories = ['Développement', 'Design', 'Marketing', 'Data Science'];
  niveaux = ['Débutant', 'Intermédiaire', 'Avancé'];
  devoirs: AssignmentTemplate[] = [];

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) {}

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
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = '';
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      const userData = await this.authService.getUserData(user.uid);
      const nomEnseignant = userData
        ? `${userData.prenom} ${userData.nom}`
        : user.email || 'Enseignant';

      const courseId = Date.now().toString();

      const course: Course = {
        id: courseId,
        titre: this.titre,
        description: this.description,
        enseignant: nomEnseignant,
        enseignantId: user.uid,
        categorie: this.categorie,
        niveau: this.niveau,
        duree: this.duree,
        note: 0,
        chapitres: this.chapitres
      };

      await this.courseService.createCourse(course);

      if (this.questions.length > 0) {
        const db = getDatabase(getApp());
        await set(ref(db, `quizzes/${courseId}`), {
          id: courseId,
          courseId: courseId,
          questions: this.questions
        });
      }
      if (this.devoirs.length > 0) {
        const db = getDatabase(getApp());
        await set(ref(db, `courseAssignments/$
        {courseId}`), {
          courseId: courseId,
          devoirs: this.devoirs
        });
      }

      this.router.navigate(['/teacher/dashboard']);
    } catch (error) {
      this.errorMessage = 'Erreur lors de la création du cours';
    } finally {
      this.isSubmitting = false;
    }
  }
}