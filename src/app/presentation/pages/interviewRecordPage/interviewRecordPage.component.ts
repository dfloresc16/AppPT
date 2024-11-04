import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-interview-record-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './interviewRecordPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InterviewRecordPageComponent { }
