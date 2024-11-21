import { QuestionJoinAnswerInputDTO } from "./QuestionJoinAnswerInputDTO";

export interface QuestionJoinAnswerInputsDTO {
  userId: number;
  interviewId: number;
  qJaIsDTOs: QuestionJoinAnswerInputDTO[];
}
