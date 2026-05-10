import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  
  role: string = '';

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.authService.getUserData(user.uid).then(data => {
        this.role = data?.role || '';
        this.cdr.detectChanges();
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}