import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service';

export interface Note {
  id?: number;
  noteText: string;
  dealId?: number;
  createdBy?: number;
  createdByName?: string;
  createdAt: Date;
  updatedBy?: number;
  updatedByName?: string;
  updatedAt?: Date;
}

export interface NoteCreate {
  noteText: string;
  dealId: number;
  createdBy: number;
}

export interface NoteUpdate {
  noteText: string;
  updatedBy: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'https://localhost:7297/api/notes';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) { }

  createNote(note: NoteCreate): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getNotesByDealId(dealId: number, userId?: number): Observable<Note[]> {
    const params = new HttpParams().set('userId', (userId || this.authService.userId).toString());
    const options = { ...this.httpOptions, params };
    
    return this.http.get<Note[]>(`${this.apiUrl}/deal/${dealId}`, options)
      .pipe(catchError(this.handleError));
  }

  updateNote(id: number, noteText: string, updatedBy?: number): Observable<Note> {
    const updateDto: NoteUpdate = { 
      noteText, 
      updatedBy: updatedBy || this.authService.userId 
    };
    
    return this.http.put<Note>(`${this.apiUrl}/${id}`, updateDto, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteNote(id: number, userId?: number): Observable<void> {
    const params = new HttpParams().set('userId', (userId || this.authService.userId).toString());
    const options = { ...this.httpOptions, params };
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please check your connection.';
      } else {
        errorMessage = `Server error: ${error.status} - ${error.message || error.statusText}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}