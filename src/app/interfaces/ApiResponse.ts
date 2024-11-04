export interface ApiResponse<T> {
  success: boolean;
  httpstatus: number;
  errorCode?: string | null;
  errorMessage: string | null;
  message: string;
  body: T;
}
