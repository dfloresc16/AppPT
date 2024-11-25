import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/security/interceptors/AuthInterceptor.interceptor';


// Inicializa la aplicación y registra el interceptor
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Proveer rutas
    provideHttpClient(withInterceptors([authInterceptor])), // Configura el interceptor
  ],
}).catch((err) => console.error(err));
