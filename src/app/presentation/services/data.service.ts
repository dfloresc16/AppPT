import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Estructura de datos según las categorías
  private data = {
    Frontend: [
      { field: 'Angular', levels: ['Trainee', 'Junior', 'Senior'] },
      { field: 'React', levels: ['Trainee', 'Junior', 'Senior'] },
      { field: 'Vue', levels: ['Trainee', 'Junior', 'Senior'] },
    ],
    Backend: [
      { field: 'Java', levels: ['Trainee', 'Junior', 'Senior'] },
      { field: 'Node.js', levels: ['Trainee', 'Junior', 'Senior'] },
      { field: 'Python', levels: ['Trainee', 'Junior', 'Senior'] },
    ],
    'Bases de Datos': [
      { field: 'MySQL', levels: ['Trainee', 'Junior', 'Senior'] },
      { field: 'PostgreSQL', levels: ['Trainee', 'Junior', 'Senior'] },
      { field: 'MongoDB', levels: ['Trainee', 'Junior', 'Senior'] },
    ],
  };

  getData(): Observable<any> {
    return of(this.data);
  }
}
