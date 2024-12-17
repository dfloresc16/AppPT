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

  constructor() {
    this.initializeSpeechRecognition();
  }

  initializeSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();

      // Configura el idioma principal como español, pero permite detectar otros idiomas
      this.speechRecognition.lang = 'es-ES';
      this.speechRecognition.interimResults = false;

      this.speechRecognition.onresult = (event: any) => {
        const newTranscript = event.results[0][0].transcript;
        this.transcript += ` ${newTranscript}`;
        console.log('Texto reconocido:', this.transcript);
      };

      this.speechRecognition.onerror = (event: any) => {
        console.error('Error en el reconocimiento de voz:', event.error);
      };
    } else {
      console.error('SpeechRecognition API no está disponible.');
    }
  }

  startRecording() {
    if (this.isRecording) {
      this.stopRecording();
      return;
    }

    this.transcript = '';
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

        // Inicia el reconocimiento de voz
        if (this.speechRecognition) {
          this.speechRecognition.start();
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

      const message = this.transcript.trim() !== ''
        ? `Texto capturado: ${this.transcript}`
        : 'No se capturó ningún texto.';

      this.showSwalAlert(
        'Grabación finalizada',
        `${message}\nDuración: ${this.recordingTime} segundos`,
        'success'
      );

      if (this.transcript.trim() !== '') {
        this.messageCaptured.emit(this.transcript);
      }

      this.transcript = '';
    }

    if (this.speechRecognition) {
      this.speechRecognition.stop();
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
    console.log('Se finalizó la grabación y se puede enviar el audio al servidor si es necesario.');
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
