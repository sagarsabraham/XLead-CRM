import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface User {
  id: number;
  name: string;
  createdByName: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private usersCache: User[] = [];
  private usersCache$: Observable<User[]> | null = null;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getUsers(): Observable<User[]> {
    if (this.usersCache$) {
      return this.usersCache$;
    }

    const source$ = this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/api/User`);
    this.usersCache$ = this.apiResponseService.handleResponse(source$).pipe(
      tap(users => {
        this.usersCache = users;
      }),
      catchError(error => {
        console.error('Error loading users, returning empty array:', error.message);
        return of([]);
      }),
      shareReplay(1)
    );
    
    return this.usersCache$;
  }

  getUserName(userId: number): Observable<string> {
    if (this.usersCache.length > 0) {
      const user = this.usersCache.find(u => u.id === userId);
      if (user) {
        return of(user.name);
      }
    }

    const source$ = this.http.get<ApiResponse<string>>(`${this.apiUrl}/api/User/name/${userId}`);
    return this.apiResponseService.handleResponse(source$).pipe(

      catchError(() => {
        console.warn(`Could not find name for userId ${userId}, returning 'Unknown User'.`);
        return of('Unknown User');
      })
    );
  }
}