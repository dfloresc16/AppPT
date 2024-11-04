import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ChaMessageComponent } from '../../components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '../../components/chat-bubbles/myMessage/myMessage.component';
import { AudioMessageBoxComponent } from '../../components/audio-boxes/audioMessageBox/audioMessageBox.component';

interface ChatMessage {
  text: string;
  isGpt: boolean;
}

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
  messages: ChatMessage[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  // Método para agregar un mensaje y forzar la actualización de la vista
  addMessage(text: string, isGpt: boolean) {
    if (text.trim() !== '') { // Solo agregar si el texto no está vacío
      this.messages.push({ text, isGpt });
      this.cdr.detectChanges(); // Forzar la actualización de la vista
    }
  }


  trackByIndex(index: number): number {
    return index;
  }


}
