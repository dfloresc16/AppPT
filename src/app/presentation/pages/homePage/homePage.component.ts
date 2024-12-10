import { QuestionJoinAnswerInputsDTO } from './../../../interfaces/QuestionJoinAnswerInputsDTO';
import { InterviewService } from './../../services/InterviewService.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChaMessageComponent } from '../../components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '../../components/chat-bubbles/myMessage/myMessage.component';
import { AudioMessageBoxComponent } from '../../components/audio-boxes/audioMessageBox/audioMessageBox.component';
import { InterviewJoinQuestionsDTO } from '../../../interfaces/InterviewJoinQuestionsDTO';
import { ApiResponse } from '../../../interfaces/ApiResponse';
import { QuestionJoinAnswerInputDTO } from '../../../interfaces/QuestionJoinAnswerInputDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ChaMessageComponent,
    MyMessageComponent,
    AudioMessageBoxComponent,
  ],
  templateUrl: './homePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {
  messages: { text: string; isGpt: boolean }[] = [];
  questionQueue: string[] = [];
  interviewId: number = 0;
  questionId: number[] = [];
  userId: number = 0;
  answers: QuestionJoinAnswerInputDTO[] = [];
  cont: number = 0;
  interviewTimeout: any; // Temporizador para el límite de tiempo
  hasAlertBeenShown = false; // Control para evitar mostrar múltiples alertas

  constructor(
    private cdr: ChangeDetectorRef,
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.confirmAndFetchInterview();
  }

  // Mostrar pop-up de confirmación antes de intentar obtener entrevistas
  confirmAndFetchInterview() {
    Swal.fire({
      icon: 'question',
      title: '¿Deseas iniciar una nueva entrevista?',
      text: 'Confirma para continuar o regresa al menú principal.',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Regresar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fetchAndProcessInterview(); // Hacer la petición solo si confirma
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/dashboard/curriculum-vitae']); // Redirigir si cancela
      }
    });
  }

  fetchAndProcessInterview() {
    console.log('Intentando obtener preguntas para userId:', this.userId);

    if (!this.userId) {
      console.error('userId no encontrado en sessionStorage.');
      return;
    }

    // Establecer límite de tiempo de 30 segundos
    this.interviewTimeout = setTimeout(() => {
      if (!this.hasAlertBeenShown) {
        this.showNoInterviewsAlert(); // Mostrar alerta después del límite de tiempo
      }
    }, 30000); // 30 segundos

    this.interviewService.generateInterview(this.userId).subscribe({
      next: (response: ApiResponse<InterviewJoinQuestionsDTO>) => {
        clearTimeout(this.interviewTimeout); // Cancelar el temporizador si se recibe respuesta

        if (response.body && response.body.questionDTOs && response.body.questionDTOs.length > 0) {
          this.questionId = response.body.questionDTOs.map(q => q.questionId);
          const questions = response.body.questionDTOs.map(q => q.bodyQuestion);

          this.interviewId = response.body.interviewId;
          this.questionQueue = [...questions];
          this.processNextQuestion();
        } else {
          this.showNoInterviewsAlert(); // Mostrar alerta si no hay entrevistas disponibles
        }
      },
      error: (err: any) => {
        clearTimeout(this.interviewTimeout); // Cancelar el temporizador si ocurre un error
        console.error('Error al generar la entrevista:', err);
        this.showNoInterviewsAlert();
      },
    });
  }

  addMessage(text: string, isGpt: boolean) {
    if (text.trim() !== '') {
      this.messages.push({ text, isGpt });

      if (!isGpt) {
        const currentQuestionId = this.questionId[this.cont];
        this.cont++;
        if (currentQuestionId) {
          this.answers.push({
            questionId: currentQuestionId,
            bodyQuestion: this.messages[this.messages.length - 2]?.text || '',
            answerUser: text,
            answerLLM: ''
          });
        }
      }

      this.cdr.detectChanges();
    }

    if (this.questionQueue.length === 0 && !isGpt) {
      this.sendUserAnswers();
    }
  }

  processNextQuestion() {
    if (this.questionQueue.length > 0) {
      const nextQuestion = this.questionQueue.shift();
      this.addMessage(nextQuestion || '', true);
    }
  }

  handleMessageCaptured(message: string) {
    this.addMessage(message, false);
    this.processNextQuestion();
  }

  sendUserAnswers() {
    const qJaOsDTOs: QuestionJoinAnswerInputsDTO = {
      userId: this.userId,
      interviewId: this.interviewId,
      qJaIsDTOs: this.answers,
    };

    this.interviewService.setUserAnswers(qJaOsDTOs).subscribe({
      next: () => {
        console.log('Respuestas enviadas exitosamente.');
        this.addMessage('Gracias por completar la entrevista.', true);
      },
      error: (err: any) => {
        console.error('Error al enviar las respuestas:', err);
        this.addMessage('Ocurrió un error al enviar las respuestas.', true);
      },
    });
  }

  // Mostrar alerta de que no hay entrevistas disponibles
  showNoInterviewsAlert() {
    this.hasAlertBeenShown = true; // Control para evitar múltiples alertas
    Swal.fire({
      icon: 'warning',
      title: 'Entrevista no disponible',
      text: 'No se encontraron entrevistas disponibles. Inténtalo más tarde.',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      this.messages = []; // Limpiar mensajes
      this.questionQueue = []; // Limpiar preguntas
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
