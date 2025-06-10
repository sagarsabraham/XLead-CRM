import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiResponseService {
  constructor() { }

  public handleResponse<T>(source$: Observable<ApiResponse<T>>): Observable<T> {
    return source$.pipe(
      map(response => {
        if (response && response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'An unknown error occurred.');
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        if (error instanceof HttpErrorResponse) {
           return throwError(() => new Error(error.message || 'A network error occurred.'));
        }
        return throwError(() => error);
      })
    );
  }
}