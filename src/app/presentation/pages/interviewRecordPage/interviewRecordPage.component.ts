import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterviewRecordDTO } from '../../../interfaces/InterviewRecordDTO';
import { InterviewService } from '../../services/InterviewService.service';
import { ResultDTO } from '../../../interfaces/ResultDTO';

@Component({
  selector: 'app-interview-record-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interviewRecordPage.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class InterviewRecordPageComponent implements OnInit {
  public interviewRecords: InterviewRecordDTO[] = [];
  public accordionStates: boolean[] = [];
  public selectedInterviewResults: ResultDTO[] | null = null;

  constructor(private interviewService: InterviewService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const userIdString = sessionStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    if (userId === null || isNaN(userId)) {
      console.error('Invalid userId:', userIdString);
      return;
    }

    this.interviewService.getInterviews(userId).subscribe({
      next: (response) => {
        this.interviewRecords = response.body?.interviewRecordDTOs.map((record) => ({
          ...record,
          dateTime: new Date(record.dateTime),
        })) || [];
        this.accordionStates = new Array(this.interviewRecords.length).fill(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching interviews:', err);
      },
    });
  }

  toggleAccordion(index: number): void {
    this.accordionStates[index] = !this.accordionStates[index];
  }

  getInterviewDetails(interviewId: number): void {
    const userIdString = sessionStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    if (userId === null || isNaN(userId)) {
      console.error('Invalid userId:', userIdString);
      return;
    }

    this.interviewService.getInterview(userId, interviewId).subscribe({
      next: (response) => {
        this.selectedInterviewResults = response.body?.resultDTOs || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching interview details:', err);
      },
    });
  }
}
