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
  styleUrls: ['./dashboardLayout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {

  public routes = routes[2].children?.filter((route) => route.data);
  public fullName: string = '';
  public userName: string = '';
  constructor() {
    // Recuperar 'name' y 'lastname' del sessionStorage
    const name = sessionStorage.getItem('name');
    const lastname = sessionStorage.getItem('lastName');
    this.userName = sessionStorage.getItem('userName') || '';
    console.log(name);
    console.log(lastname)
    console.log(this.userName);

    // Formar el string completo y asignarlo a 'fullName'
    this.fullName = `${name || ''} ${lastname || ''}`.trim();
    // Imprimir el contenido de 'routes' y 'fullName' en la consola
    console.log(this.routes);
    console.log(this.fullName);
  }

  // trackBy function para mejorar el rendimiento en *ngFor
  trackByPath(index: number, route: any): string {
    return route.path;
  }
}
