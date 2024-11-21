import { QuestionDTO } from "./QuestionDTO";

export interface InterviewJoinQuestionsDTO {
  interviewId: number;
  questionDTOs: QuestionDTO[];
}
