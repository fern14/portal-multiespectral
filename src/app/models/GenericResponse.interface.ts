export interface GenericResponse<T = any> {
    data: T;
    message: string;
    status: number;
  }