import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'student',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/student/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'catalogue',
        loadComponent: () => import('./features/student/catalogue/catalogue.component')
          .then(m => m.CatalogueComponent)
      },
      {
        path: 'course/:id',
        loadComponent: () => import('./features/student/course-detail/course-detail.component')
          .then(m => m.CourseDetailComponent)
      },
      {
        path: 'course/:id/player',
        loadComponent: () => import('./features/student/course-player/course-player.component')
          .then(m => m.CoursePlayerComponent)
      },
      {
        path: 'quiz/:id',
        loadComponent: () => import('./features/student/quiz/quiz.component')
          .then(m => m.QuizComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/student/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'assignment/:id',
        loadComponent: () => import('./features/student/assignment/assignment.component')
          .then(m => m.AssignmentComponent)
      }
    ]
  },
  {
    path: 'teacher',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/teacher/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'create-course',
        loadComponent: () => import('./features/teacher/create-course/create-course.component')
          .then(m => m.CreateCourseComponent)
      },
      {
        path: 'course/:id',
        loadComponent: () => import('./features/teacher/edit-course/edit-course.component')
          .then(m =>m.EditCourseComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];