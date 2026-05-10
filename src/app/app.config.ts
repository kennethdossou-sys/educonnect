import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

const app = initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  ]
};

export { app };