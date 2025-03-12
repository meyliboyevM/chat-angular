import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './common/auth/auth.interceptor';
import {ErrorInterceptor} from './pages/error/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ]
};
