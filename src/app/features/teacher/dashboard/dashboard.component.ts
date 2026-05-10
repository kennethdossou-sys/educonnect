import { Component, OnInit,inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../shared/models/course.model';
import { TeacherStats } from '../../../shared/models/teacher.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  courses: Course[] = [];
  stats: TeacherStats = {
    totalCours: 0,
    totalEtudiants: 0,
    devoirsACorriger: 0,
    noteMoyenne: 0
  };


  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
  const user = this.authService.getCurrentUser();
  if (!user) {
    this.router.navigate(['/auth/login']);
    return;
  }
  this.authService.getUserData(user.uid).then(data => {
    if (data?.role !== 'enseignant') {
      this.router.navigate(['/student/home']);
    }
  });
  this.loadDashboard();
}

  async loadDashboard() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.courses = await this.courseService.getCoursesByTeacher(user.uid);
    this.stats.totalCours = this.courses.length;
    this.stats.noteMoyenne = this.courses.reduce(
      (acc, c) => acc + c.note, 0
    ) / this.courses.length || 0;
  }

  async deleteCourse(courseId: string) {
  if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
    await this.courseService.deleteCourse(courseId);
    this.courses = this.courses.filter(c => c.id !== courseId);
    this.cdr.detectChanges();
  }
}
}