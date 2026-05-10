import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Course, Chapitre } from '../../../shared/models/course.model';
import { getDatabase, ref, get } from 'firebase/database';
import { getApp } from 'firebase/app';
import { SafePipe } from '../../../shared/pipes/safe-pipe';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterLink, SafePipe],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.css'
})
export class CoursePlayerComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  course: Course | null = null;
  currentChapitre: Chapitre | null = null;
  currentIndex = 0;
  progression = 0;

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
        if (this.course?.chapitres?.length) {
          this.currentChapitre = this.course.chapitres[0];
          this.updateProgression();
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      this.cdr.detectChanges();
    }
  }

  selectChapitre(index: number) {
    if (!this.course?.chapitres) return;
    this.currentIndex = index;
    this.currentChapitre = this.course.chapitres[index];
    this.updateProgression();
    this.cdr.detectChanges();
  }

  nextChapitre() {
    if (!this.course?.chapitres) return;
    if (this.currentIndex < this.course.chapitres.length - 1) {
      this.selectChapitre(this.currentIndex + 1);
    }
  }

  updateProgression() {
    if (!this.course?.chapitres) return;
    this.progression = Math.round(
      ((this.currentIndex + 1) / this.course.chapitres.length) * 100
    );
  }

  isLastChapitre(): boolean {
    return this.currentIndex === (this.course?.chapitres?.length || 0) - 1;
  }

  getEmbedUrl(url: string): string {
    if (!url) return '';
    // Convertit automatiquement les URLs YouTube normales en URLs embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
}