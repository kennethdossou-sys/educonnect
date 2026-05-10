import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { getApp } from 'firebase/app';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Course } from '../../../shared/models/course.model';
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
  coursesInProgress: Course[] = [];
  coursesRecommanded: Course[] = [];
  searchQuery = '';
  isLoading = true;
  private router = inject(Router);
private authService = inject(AuthService);

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
}

  loadCourses() {
  const db = getDatabase(getApp());
  const coursesRef = ref(db, 'courses');
  console.log('DB URL:', db.app.options);
  onValue(coursesRef, (snapshot) => {
    console.log('Data:', snapshot.val());
    if (snapshot.exists()) {
      const data = snapshot.val();
      this.coursesRecommanded = Object.entries(data).map(
        ([id, val]: [string, any]) => ({
          ...val,
          id,
          chapitres: val.chapitres
            ? Object.values(val.chapitres)
            : []
        })
      );
    }
    this.isLoading = false;
    this.cdr.detectChanges();
  });
}

  onSearch() {}
}