import { CVFieldDTO } from "./CVFieldDTO";

// Define la interfaz para CurriculumVitaeDTO
export interface CurriculumVitaeDTO {
  userId?: number;
  token?: string;
  cvFieldsDTOs: CVFieldDTO[];
}
