import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterviewRecordDTO } from '../../../interfaces/InterviewRecordDTO';
import { InterviewService } from '../../services/InterviewService.service';
import { ResultDTO } from '../../../interfaces/ResultDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-interview-record-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interviewRecordPage.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class InterviewRecordPageComponent implements OnInit {
  public interviewRecords: InterviewRecordDTO[] = [];
  public paginatedRecords: InterviewRecordDTO[] = [];
  public accordionStates: boolean[] = [];
  public selectedInterviewResults: { interviewId: number; details: ResultDTO[] } | null = null;

  public currentPage = 1;
  public pageSize = 10; // Número de registros por página
  public totalPages = 0;

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
        this.totalPages = Math.ceil(this.interviewRecords.length / this.pageSize);
        this.updatePage();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching interviews:', err);
      },
    });
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRecords = this.interviewRecords.slice(start, end);
    this.accordionStates = new Array(this.paginatedRecords.length).fill(false);
  }

  toggleAccordion(index: number): void {
    // Alternar el estado del acordeón
    this.accordionStates[index] = !this.accordionStates[index];

    // Si se cierra el acordeón, limpiar `selectedInterviewResults` si corresponde al `interviewId`
    if (!this.accordionStates[index] && this.selectedInterviewResults?.interviewId === this.paginatedRecords[index].interviewId) {
      this.selectedInterviewResults = null;
    }
  }

  getInterviewDetails(interviewId: number): void {
    if (this.selectedInterviewResults?.interviewId === interviewId) {
      // Si ya cargamos los detalles para esta entrevista, no hacemos otra solicitud
      return;
    }

    const userIdString = sessionStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    if (userId === null || isNaN(userId)) {
      console.error('Invalid userId:', userIdString);
      return;
    }

    this.interviewService.getInterview(userId, interviewId).subscribe({
      next: (response) => {
        this.selectedInterviewResults = {
          interviewId,
          details: response.body?.resultDTOs || [],
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching interview details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontraron datos de la entrevista.',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePage();
    }
  }
}
