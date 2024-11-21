import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../../interfaces/ApiResponse';
import { environment } from '../../../environments/environment';
import { InterviewJoinQuestionsDTO } from '../../interfaces/InterviewJoinQuestionsDTO';
import { InterviewRecordsDTO } from '../../interfaces/InterviewRecordsDTO';
import { InterviewJoinResultsDTO } from './../../interfaces/InterviewJoinResultsDTO';
import { QuestionJoinAnswerInputsDTO } from '../../interfaces/QuestionJoinAnswerInputsDTO';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private apiUrl = `${environment.baseUrl}/interview`;

  constructor(private http: HttpClient) {}

  // Genera una entrevista con preguntas para un usuario
  generateInterview(userId: number): Observable<ApiResponse<InterviewJoinQuestionsDTO>> {
    return this.http.post<ApiResponse<InterviewJoinQuestionsDTO>>(
      `${this.apiUrl}/generateInterview/${userId}`, {}
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }

  // Obtiene los overviews de las entrevistas de un usuario
  getInterviews(userId: number): Observable<ApiResponse<InterviewRecordsDTO>> {
    return this.http.get<ApiResponse<InterviewRecordsDTO>>(
      `${this.apiUrl}/getInterviews/${userId}`
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }

  // Obtiene una entrevista realizada por un usuario
  getInterview(userId: number, interviewId: number): Observable<ApiResponse<InterviewJoinResultsDTO>> {
    return this.http.get<ApiResponse<InterviewJoinResultsDTO>>(
      `${this.apiUrl}/getInterview/${userId}/${interviewId}`
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }

  // Establece las respuestas de un usuario para una entrevista
  setUserAnswers(qJaOsDTOs: QuestionJoinAnswerInputsDTO): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/setUserAnswers`, qJaOsDTOs
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error.error))
    );
  }
}
