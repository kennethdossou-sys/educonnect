import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getApp } from 'firebase/app';
import { Course } from '../../../shared/models/course.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCategorie = 'Tous';
  selectedNiveau = 'Tous niveaux';

  categories = ['Tous', 'Développement', 'Design', 'Marketing', 'Data Science'];
  niveaux = ['Tous niveaux', 'Débutant', 'Intermédiaire', 'Avancé'];

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    const db = getDatabase(getApp());
    onValue(ref(db, 'courses'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.courses = Object.entries(data).map(([id, val]: [string, any]) => ({
          ...val,
          id,
          chapitres: val.chapitres ? Object.values(val.chapitres) : []
        }));
        this.filteredCourses = this.courses;
      }
      this.cdr.detectChanges();
    });
  }

  filterCourses() {
    this.filteredCourses = this.courses.filter(course => {
      const categorieMatch = this.selectedCategorie === 'Tous' ||
                             course.categorie === this.selectedCategorie;
      const niveauMatch = this.selectedNiveau === 'Tous niveaux' ||
                          course.niveau === this.selectedNiveau;
      return categorieMatch && niveauMatch;
    });
    this.cdr.detectChanges();
  }
}