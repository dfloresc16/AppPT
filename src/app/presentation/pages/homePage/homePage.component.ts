import { QuestionJoinAnswerInputsDTO } from './../../../interfaces/QuestionJoinAnswerInputsDTO';
import { InterviewService } from './../../services/InterviewService.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ChaMessageComponent } from '../../components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '../../components/chat-bubbles/myMessage/myMessage.component';
import { AudioMessageBoxComponent } from '../../components/audio-boxes/audioMessageBox/audioMessageBox.component';
import { InterviewJoinQuestionsDTO } from '../../../interfaces/InterviewJoinQuestionsDTO';
import { ApiResponse } from '../../../interfaces/ApiResponse';
import { QuestionJoinAnswerInputDTO } from '../../../interfaces/QuestionJoinAnswerInputDTO';

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

  constructor(
    private cdr: ChangeDetectorRef,
    private interviewService: InterviewService
  ) { }

  ngOnInit() {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.fetchAndProcessInterview();
  }

  // Método para agregar un mensaje y procesar respuestas del usuario
  addMessage(text: string, isGpt: boolean) {
    if (text.trim() !== '') {
      this.messages.push({ text, isGpt });

      if (!isGpt) {
        // Almacenar respuesta del usuario
        const currentQuestionId = this.questionId[this.cont];
        this.cont++;
        console.log("currentQuestionId: " + currentQuestionId);

        if (currentQuestionId) {
          this.answers.push({
            questionId: currentQuestionId,
            bodyQuestion: this.messages[this.messages.length - 2]?.text || '',
            answerUser: text,
          });
          console.log(`this.answers ${JSON.stringify(this.answers)}`);

        }
      }

      this.cdr.detectChanges(); // Forzar actualización de la vista
    }

    // Verificar si la cola está vacía
    if (this.questionQueue.length === 0 && !isGpt) {
      this.sendUserAnswers();
    }
  }
  fetchAndProcessInterview() {
    console.log('Intentando obtener preguntas para userId:', this.userId);

    if (!this.userId) {
      console.error('userId no encontrado en sessionStorage.');
      return;
    }

    this.interviewService.generateInterview(this.userId).subscribe({
      next: (response: ApiResponse<InterviewJoinQuestionsDTO>) => {
        console.log('Respuesta obtenida del servicio:', response);

        if (response.body && response.body.questionDTOs) {
          // Mapear los `questionId` a un arreglo
          this.questionId = response.body.questionDTOs.map(q => q.questionId);
          console.log("this.questionId.length :: " + this.questionId.length);
          // Mapear las preguntas en sí
          const questions = response.body.questionDTOs.map(q => q.bodyQuestion);

          this.interviewId = response.body.interviewId;
          this.questionQueue = [...questions];
          console.log('Preguntas obtenidas y almacenadas en questionQueue:', this.questionQueue);

          // Procesar la primera pregunta
          this.processNextQuestion();
        } else {
          console.warn('No se encontraron preguntas en la respuesta:', response);
        }
      },
      error: (err: any) => {
        console.error('Error al generar la entrevista:', err);
        this.addMessage('Ocurrió un error al generar la entrevista.', true);
      },
    });
  }

  // Método para procesar la siguiente pregunta
  processNextQuestion() {
    if (this.questionQueue.length > 0) {
      const nextQuestion = this.questionQueue.shift();
      this.addMessage(nextQuestion || '', true);
    }
  }

  // Método para manejar la captura de mensajes
  handleMessageCaptured(message: string) {
    this.addMessage(message, false); // Mensaje del usuario
    this.processNextQuestion(); // Procesar la siguiente pregunta
  }

  // Enviar respuestas del usuario al backend
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

  trackByIndex(index: number): number {
    return index;
  }
}
