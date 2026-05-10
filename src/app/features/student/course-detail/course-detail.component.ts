import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../shared/models/course.model';
import { getDatabase, ref, get } from 'firebase/database';
import { getApp } from 'firebase/app';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(AuthService);

  course: Course | null = null;
  isEnrolled = false;
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadCourse(id);
  }

  async loadCourse(id: string) {
    try {
      const db = getDatabase(getApp());
      const snapshot = await get(ref(db, `courses/${id}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.course = {
          ...data,
          id,
          chapitres: data.chapitres
            ? Object.values(data.chapitres)
            : []
        };
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async enroll() {
    const user = this.authService.getCurrentUser();
    if (!user || !this.course) return;
    await this.enrollmentService.enrollCourse(user.uid, {
      id: this.course.id,
      titre: this.course.titre,
      progression: 0,
      score: 0,
      statut: 'en_cours'
    });
    this.isEnrolled = true;
    this.cdr.detectChanges();
  }
}