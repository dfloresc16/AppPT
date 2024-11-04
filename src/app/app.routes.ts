import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './presentation/layouts/dashboardLayout/dashboardLayout.component';
import { isAuthenticatedGuard } from './security/guards/isAuthenticated.guard';
import { AuthLayoutComponent } from './presentation/layouts/authLayout/authLayout.component';


export const routes: Routes = [
  // Rutas del layout de autenticación
  {
    path: 'auth',
    component: AuthLayoutComponent, // Layout para autenticación
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./presentation/pages/loginPage/loginPage.component').then((m) => m.default),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./presentation/pages/registerPage/registerPage.component').then((m) => m.default),
      },
      {
        path: 'activate',
        loadComponent: () =>
          import('./presentation/pages/activePage/activePage.component').then((m) => m.default)
      }
    ],
  },
  // Rutas del dashboard (protección con guard)
  {
    path: '',
    component: DashboardLayoutComponent,
    // canActivate: [isAuthenticatedGuard], // Verifica si el usuario está autenticado
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./presentation/pages/homePage/homePage.component').then((m) => m.default),
        data: { icon: 'fa-solid fa-house', title: 'Home', description: 'Página principal' },
      },
      {
        path: 'curriculum-vitae',
        loadComponent: () =>
          import('./presentation/pages/informationCVPage/informationCVPage.component').then((m) => m.default),
        data: { icon: 'fa-solid fa-file-lines', title: 'Curriculum Vitae', description: 'Información sobre el curriculum vitae' },
      },
      {
        path: 'record-interview',
        loadComponent: () =>
          import('./presentation/pages/interviewRecordPage/interviewRecordPage.component').then((m) => m.default),
        data: { icon: 'fa-solid fa-calendar-check', title: 'Interview Record', description: 'Historial de entrevistas' },
      },
      // {
      //   path: 'text-to-audio',
      //   loadComponent: () =>
      //     import('./presentation/pages/textToAudioPage/textToAudioPage.component').then((m) => m.default),
      //   data: { icon: 'fa-solid fa-file-audio', title: 'Texto a audio', description: 'Convertir texto a audio' },
      // },
      {
        path: 'interview',
        loadComponent: () =>
          import('./presentation/pages/audioToTextPage/audioToTextPage.component').then((m) => m.default),
        data: { icon: 'fa-solid fa-microphone', title: 'Interview', description: 'Convertir audio a texto' },
      },
    ],
  },
  // Redirección por defecto
  {
    path: '**',
    redirectTo: 'auth/login', // Redirige a login si la ruta no existe
    pathMatch: 'full',
  },
];
