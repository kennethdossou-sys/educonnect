import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-register',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  role: 'etudiant' | 'enseignant' = 'etudiant';
  errorMessage = '';
  isLoading = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  async onRegister(){
    if(this.password.length < 6){
      this.errorMessage = 'Le mot de passe doit au moins contenir 6 caractères';
      return;
    }
    this.isLoading = true;
    this.errorMessage='';
    try{
      await this.authService.register(
        this.email,
        this.password,
        this.nom,
        this.prenom,
        this.role
      );
      if (this.role === 'etudiant'){
        this.router.navigate(['/student/home']);
      }else{
        this.router.navigate(['/teacher/dashboard'])
      }
    }catch(error){
      this.errorMessage = 'Erreur lors de l\'inscription';
    }finally{
      this.isLoading = false;
    }
  }
}
