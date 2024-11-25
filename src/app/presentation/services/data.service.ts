import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { CurriculumVitaeDTO } from '../../interfaces/CurriculumVitaeDTO';
import { ApiResponse } from '../../interfaces/ApiResponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private apiUrl = `${environment.baseUrl}`
  // private apiUrl = "http://192.168.3.3:8082/cv/createCV"

  constructor(private http: HttpClient) {}
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

  getDataCV(userId: number): Observable<ApiResponse<CurriculumVitaeDTO>> {
    return this.http.get<ApiResponse<CurriculumVitaeDTO>>(
      `${this.apiUrl}/cv/getDataCV/${userId}` // Endpoint para obtener datos del CV
    ).pipe(
      tap({
        next: (response) => console.log('Datos del CV obtenidos exitosamente:', response),
        error: (error) => console.error('Error al obtener los datos del CV:', error),
      }),
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }


  crearCV(cvDTO: CurriculumVitaeDTO,userId: number): Observable<ApiResponse<CurriculumVitaeDTO>> {
    console.log("entre");

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/cv/createCV/${userId}`, // Endpoint para crear el CV
      cvDTO // Envía el objeto cvDTO en el cuerpo de la solicitud
    ).pipe(
      tap({
        next: (response) => console.log('Respuesta exitosa:', response),
        error: (error) => console.error('Error en la solicitud:', error)
      }),
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }


  actualizarCV(cvDTO: CurriculumVitaeDTO, userId: number): Observable<ApiResponse<CurriculumVitaeDTO>> {
    return this.http.put<ApiResponse<CurriculumVitaeDTO>>(
      `${this.apiUrl}/cv/updateCV/${userId}`, // Endpoint para actualizar el CV
      cvDTO // Envía el objeto cvDTO en el cuerpo de la solicitud
    ).pipe(
      tap({
        next: (response) => console.log('CV actualizado exitosamente:', response),
        error: (error) => console.error('Error al actualizar el CV:', error),
      }),
      map((response) => response),
      catchError((error) => throwError(() => error.error)) // Manejo de errores
    );
  }

}
