import { TokenDTO } from './../../interfaces/TokenDTO';
import { UserDTO } from './../../interfaces/UserDTO';
import { UserLoginDTO } from './../../interfaces/userLoginDTO';
import { ApiResponse } from './../../interfaces/ApiResponse';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Activacion } from '../../interfaces/Activation';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}`;

  private router = inject(Router);

  constructor(private http: HttpClient) { }

  login(userLoginDTO: UserLoginDTO): Observable<ApiResponse<TokenDTO>> {
    return this.http.post<ApiResponse<TokenDTO>>(`${this.apiUrl}/auth/login`, userLoginDTO).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }

  create(userData: UserDTO): Observable<ApiResponse<UserDTO>> {
    return this.http.post<ApiResponse<UserDTO>>(`${this.apiUrl}/auth/create`, { data: userData }).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }

  validate(token: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/auth/validate?token=${encodeURIComponent(token)}`,
      {}
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }


  getUser(userData: UserDTO): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('userId', userData.userId.toString())
      .set('userName', userData.userName);

    // Cambiamos la solicitud a GET y añadimos los query parameters
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/user/getUser`,
      { params } // Agregamos los parámetros como query parameters
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }

  // auth.service.ts
  logout(): void {
    sessionStorage.removeItem('access_token'); // Elimina el token de sessionStorage
    this.router.navigateByUrl('/login');
  }


  activarCuenta(activation: Activacion):Observable<ApiResponse<any>>{
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/auth/validate?token=${encodeURIComponent('')}`,
      {}
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }



}
