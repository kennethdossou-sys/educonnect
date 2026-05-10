import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { QuizService } from '../../../core/services/quiz.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Assignment } from '../../../shared/models/assignment.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Enrollment,QuizResult } from '../../../shared/models/enrollment.model';


@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [RouterLink,CommonModule,FormsModule,NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  coursesInProgress: Enrollment[] = [];
  CoursesFinishes: Enrollment[] = [];
  resultatsQuiz: QuizResult[] = [];
  devoirsARendre: Assignment[] = [];

  constructor(
    private enrollmentService: EnrollmentService,
    private quizService: QuizService,
    private authService: AuthService
  ){}

  ngOnInit(){
    this.loadDashboard();

  }

  async loadDashboard(){
    const user = this.authService.getCurrentUser();
    if(!user) return;

    this.coursesInProgress = await this.enrollmentService.getCoursesInProgress(user.uid);
    this.CoursesFinishes = await this.enrollmentService.getCoursesFinishes(user.uid);
    this.resultatsQuiz = await this.quizService.getResultatsQuiz(user.uid);
    this.devoirsARendre = await this.enrollmentService.getDevoirsARendre(user.uid);
  }

}
