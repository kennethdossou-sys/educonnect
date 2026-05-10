import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { QuizService } from '../../../core/services/quiz.service';
import { AuthService } from '../../../core/services/auth.service';
import { Quiz, Question } from '../../../shared/models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizService);
  private authService = inject(AuthService);

  quiz: Quiz | null = null;
  currentIndex = 0;
  selectedReponse: number | null = null;
  score = 0;
  isFinished = false;
  isLoading = true;

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) this.loadQuiz(courseId);
  }

  async loadQuiz(courseId: string) {
    try {
      this.quiz = await this.quizService.getQuizByCourse(courseId);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  get currentQuestion(): Question | null {
    return this.quiz?.questions[this.currentIndex] || null;
  }

  get progression(): number {
    if (!this.quiz) return 0;
    return Math.round(
      ((this.currentIndex + 1) / this.quiz.questions.length) * 100
    );
  }

  selectReponse(index: number) {
    this.selectedReponse = index;
    this.cdr.detectChanges();
  }

  valider() {
    if (this.selectedReponse === null || !this.currentQuestion) return;
    if (this.selectedReponse === this.currentQuestion.bonneReponse) {
      this.score++;
    }
    if (this.currentIndex < (this.quiz?.questions.length || 0) - 1) {
      this.currentIndex++;
      this.selectedReponse = null;
    } else {
      this.finishQuiz();
    }
    this.cdr.detectChanges();
  }

  async finishQuiz() {
    this.isFinished = true;
    const user = this.authService.getCurrentUser();
    if (!user || !this.quiz) return;
    await this.quizService.saveResultat(user.uid, {
      id: this.quiz.id,
      titre: this.quiz.id,
      score: Math.round((this.score / this.quiz.questions.length) * 100),
      date: new Date().toISOString()
    });
    this.cdr.detectChanges();
  }
}