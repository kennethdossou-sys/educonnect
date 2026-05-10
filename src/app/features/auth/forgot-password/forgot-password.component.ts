import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  email= '';
  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  
  constructor(private authService: AuthService){} 

  async onSubmit(){
    if(!this.email) {
      this.errorMessage = 'Veuillez entrer votre email';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    try{
      await this.authService.resetPassword(this.email);
      this.isSuccess = true;
    }catch(error){
      this.errorMessage = 'Email introuvable ou invalide'
    }finally{
      this.isLoading = false;
    }
  }
}
