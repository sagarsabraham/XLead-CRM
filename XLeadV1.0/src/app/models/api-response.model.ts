export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  statusCode: number;
  data: T | null;
}