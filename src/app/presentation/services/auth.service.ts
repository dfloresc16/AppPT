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
import { UserRespLoginDTO } from '../../interfaces/UserRespLoginDTO';

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
    console.log('User data being sent:', userData);
    return this.http.post<ApiResponse<UserDTO>>(`${this.apiUrl}/auth/create`, userData).pipe(
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


  getUserByEmail(email: string): Observable<ApiResponse<UserRespLoginDTO>> {
    const params = new HttpParams().set('email', email); // Pasamos 'email' como query parameter

    // Cambiamos la solicitud a GET y añadimos los query parameters
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/user/getUserByEmail`, // Endpoint ajustado a "/user/getUserByEmail"
      { params } // Agregamos los parámetros como query parameters
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error)) // Manejo de errores
    );
  }


  // auth.service.ts
  logout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  activarCuenta(activation: Activacion):Observable<ApiResponse<any>>{
    console.log(` activation  ::: ${activation.pin}`)
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/auth/active?pin=${activation.pin}`,
      {}
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }

  sendPin(email: string): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('email', email); // Pasamos 'email' como query parameter    // Cambiamos la solicitud a GET y añadimos los query parameters
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/auth/sendPIN`, // Endpoint ajustado a "/user/getUserByEmail"
      { params } // Agregamos los parámetros como query parameters
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error)) // Manejo de errores
    );
  }

  recoveryPassword(userData: UserDTO): Observable<ApiResponse<TokenDTO>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/auth/recoveryPass`, userData).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }


}
