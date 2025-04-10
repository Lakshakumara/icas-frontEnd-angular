
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './app/auth-interceptor.service';
import { MyTableModule } from './app/tableFactory/tableModel/table.module';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent,{
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MyTableModule,
    ),
  ],
}).catch(err => console.error(err));