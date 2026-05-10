import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Assignment } from '../../../shared/models/assignment.model';
import { getDatabase, ref, get } from 'firebase/database';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css'
})
export class AssignmentComponent implements OnInit {
  assignment: Assignment | null = null;
  commentaire = '';
  fichier: File | null = null;
  isLoading = true;
  isSubmitting = false;
  isSubmitted = false;
  private db = getDatabase();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enrollmentService: EnrollmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadAssignment(id);
  }

  async loadAssignment(id: string) {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const snapshot = await get(
      ref(this.db, `assignments/${user.uid}/${id}`)
    );
    if (snapshot.exists()) {
      this.assignment = snapshot.val() as Assignment;
    }
    this.isLoading = false;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fichier = input.files[0];
    }
  }

  async onSubmit() {
    if (!this.assignment || !this.fichier) return;
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.isSubmitting = true;
    try {
      await this.enrollmentService.submitDevoir(user.uid, {
        ...this.assignment,
        statut: 'soumis'
      });
      this.isSubmitted = true;
    } catch (error) {
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }
}