import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { getApp } from 'firebase/app';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { Course } from '../../../shared/models/course.model';
import { Enrollment } from '../../../shared/models/enrollment.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  coursesInProgress: Enrollment[] = [];
  coursesRecommanded: Course[] = [];
  searchQuery = '';
  isLoading = true;

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.authService.getUserData(user.uid).then(data => {
      if (data?.role !== 'etudiant') {
        this.router.navigate(['/teacher/dashboard']);
      }
    });
    this.loadCourses();
    this.loadCoursesInProgress(user.uid);
  }

  loadCourses() {
    const db = getDatabase(getApp());
    const coursesRef = ref(db, 'courses');
    onValue(coursesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.coursesRecommanded = Object.entries(data).map(
          ([id, val]: [string, any]) => ({
            ...val,
            id,
            chapitres: val.chapitres ? Object.values(val.chapitres) : []
          })
        );
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  async loadCoursesInProgress(uid: string) {
    try {
      const db = getDatabase(getApp());
      const snapshot = await get(ref(db, `enrollments/${uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.coursesInProgress = Object.values(data).filter(
          (e: any) => e.statut === 'en_cours' || e.statut === 'inscrit'
        ) as Enrollment[];
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erreur enrollments:', error);
    }
  }

  onSearch() {}
}