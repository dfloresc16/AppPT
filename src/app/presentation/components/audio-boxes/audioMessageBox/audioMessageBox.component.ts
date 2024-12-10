import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { from, interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-audio-message-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audioMessageBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioMessageBoxComponent {
  @Output() messageCaptured = new EventEmitter<string>();

  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  transcript: string = '';
  isRecording: boolean = false;
  recordingTime: number = 0;
  timerSubscription!: Subscription;

  private speechRecognition: any;
  private silenceTimeout: any;

  constructor() {
    this.initializeSpeechRecognition();
  }

  initializeSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.lang = 'es-ES';
      this.speechRecognition.interimResults = false;

      this.speechRecognition.onresult = (event: any) => {
        this.transcript = event.results[0][0].transcript;
        console.log('Texto reconocido:', this.transcript);

        // Reinicia el temporizador de silencio
        if (this.silenceTimeout) {
          clearTimeout(this.silenceTimeout);
        }
        this.silenceTimeout = setTimeout(() => {
          console.log('Silencio prolongado detectado, deteniendo la grabación.');
          this.stopRecording();
        }, 5000); // Tiempo de espera para detener por silencio prolongado (en ms)
      };

      this.speechRecognition.onspeechend = () => {
        console.log('Silencio detectado, esperando para verificar.');
        this.silenceTimeout = setTimeout(() => {
          console.log('Silencio prolongado detectado, deteniendo la grabación.');
          this.stopRecording();
        }, 5000); // Tiempo de espera para detener por silencio prolongado (en ms)
      };

      this.speechRecognition.onerror = (event: any) => {
        console.error('Error al reconocer el audio:', event.error);
        this.stopRecording();
      };
    } else {
      console.error('SpeechRecognition API no está disponible.');
    }
  }

  startRecording() {
    this.transcript = ''; // Reinicia la transcripción al comenzar una nueva grabación

    const getMedia$ = from(navigator.mediaDevices.getUserMedia({ audio: true }));

    getMedia$.subscribe({
      next: (stream) => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioChunks = [];
          this.convertAudioToText(audioBlob);
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        this.startTimer();

        this.showSwalAlertAutoClose('Grabación iniciada', 'La grabación ha comenzado.', 'info');

        if (this.speechRecognition) {
          try {
            this.speechRecognition.start();
          } catch (error) {
            console.warn('El reconocimiento de voz ya estaba en ejecución.');
          }
        }
      },
      error: (error) => {
        console.error('Error al acceder al micrófono:', error);
      },
    });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopTimer();

      // Mostrar siempre la alerta, incluso si no hay texto capturado
      const message = this.transcript.trim() !== ''
        ? `Texto: ${this.transcript}`
        : 'No se reconoció ningún texto.';

      this.showSwalAlert(
        'Grabación finalizada',
        `${message}\nDuración: ${this.recordingTime} segundos`,
        'success'
      );

      // Emitir solo si hay texto capturado
      if (this.transcript.trim() !== '') {
        this.messageCaptured.emit(this.transcript);
      }

      this.transcript = ''; // Reiniciar la transcripción
    }

    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }

    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
    }
  }

  startTimer() {
    this.recordingTime = 0;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.recordingTime++;
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  convertAudioToText(_audioBlob: Blob) {
    if (!this.speechRecognition) {
      console.error('SpeechRecognition API no está disponible.');
      return;
    }
  }

  showSwalAlertAutoClose(title: string, text: string, icon: 'info' | 'success' | 'error') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      timer: 1000,
      showConfirmButton: false,
      allowOutsideClick: true,
      backdrop: false,
    });
  }

  showSwalAlert(title: string, text: string, icon: 'info' | 'success' | 'error') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Aceptar',
    });
  }
}
