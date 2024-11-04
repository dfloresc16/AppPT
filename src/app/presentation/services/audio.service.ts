import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private transcriptSource = new BehaviorSubject<string>(''); // Almacena el último texto
  transcript$ = this.transcriptSource.asObservable(); // Observable para que otros componentes lo escuchen

  // Método para actualizar el texto
  updateTranscript(newTranscript: string) {
    this.transcriptSource.next(newTranscript);
  }
}
