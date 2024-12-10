import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarMenuItemComponent } from '../../components/sidebarMenuItem/sidebarMenuItem.component';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarMenuItemComponent
  ],
  templateUrl: './dashboardLayout.component.html',
  styleUrl: './dashboardLayout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {

  public routes = routes[2].children?.filter((route) => route.data);
  public fullName: string = '';

  constructor() {
    // Recuperar 'name' y 'lastname' del sessionStorage
    const name = sessionStorage.getItem('name');
    const lastname = sessionStorage.getItem('lastname');

    // Formar el string completo y asignarlo a 'fullName'
    this.fullName = `${name || ''} ${lastname || ''}`.trim();

    // Imprimir el contenido de 'routes' y 'fullName' en la consola
    console.log(this.routes);
    console.log(this.fullName);
  }
}
