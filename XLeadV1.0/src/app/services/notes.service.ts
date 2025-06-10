import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';
import { AuthService } from './auth-service.service';
import { Inject } from '@angular/core';

export interface Note {
  id: number;
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
  private apiUrl = `${environment.apiUrl}/api/notes`; 
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(
    private http: HttpClient,
    @Inject(AuthService) private authService: AuthService,
    private apiResponseService: ApiResponseService
  ) { }

  createNote(note: NoteCreate): Observable<Note> {
    const source$ = this.http.post<ApiResponse<Note>>(this.apiUrl, note, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getNotesByDealId(dealId: number, userId?: number): Observable<Note[]> {
    const effectiveUserId = userId || this.authService.getUserId();
    if (!effectiveUserId) {
        return throwError(() => new Error('User ID is not available for fetching notes.'));
    }
    const params = new HttpParams().set('userId', effectiveUserId.toString());
    const options = { ...this.httpOptions, params };
   
    const source$ = this.http.get<ApiResponse<Note[]>>(`${this.apiUrl}/deal/${dealId}`, options);
    return this.apiResponseService.handleResponse(source$);
  }

  updateNote(id: number, noteText: string, updatedBy?: number): Observable<Note> {
    const effectiveUserId = updatedBy || this.authService.getUserId();
     if (!effectiveUserId) {
        return throwError(() => new Error('User ID is not available for updating a note.'));
    }
    const updateDto: NoteUpdate = {
      noteText,
      updatedBy: effectiveUserId
    };
   
    const source$ = this.http.put<ApiResponse<Note>>(`${this.apiUrl}/${id}`, updateDto, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  deleteNote(id: number, userId?: number): Observable<void> {
    const effectiveUserId = userId || this.authService.getUserId();
     if (!effectiveUserId) {
        return throwError(() => new Error('User ID is not available for deleting a note.'));
    }
    const params = new HttpParams().set('userId', effectiveUserId.toString());
    const options = { ...this.httpOptions, params };
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }
}