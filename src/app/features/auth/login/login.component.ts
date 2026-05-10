import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/student/home']);
    } catch (error) {
      this.errorMessage = 'Email ou mot de passe incorrect';
    } finally {
      this.isLoading = false;
    }
  }
}