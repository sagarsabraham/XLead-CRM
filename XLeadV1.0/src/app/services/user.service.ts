// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  private users: User[] = [];
  private usersLoaded = false;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    if (this.usersLoaded) {
      return of(this.users);
    }
    
    return this.http.get<User[]>(`${this.apiUrl}/api/User`).pipe(
      map(users => {
        this.users = users;
        this.usersLoaded = true;
        return users;
      }),
      catchError(error => {
        console.error('Error loading users:', error);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getUserName(userId: number): Observable<string> {
    // First try to get from cached users
    if (this.usersLoaded) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        return of(user.name);
      }
    }
    
    // If not found in cache, get from API
    return this.http.get<string>(`${this.apiUrl}/api/User/name/${userId}`).pipe(
      catchError(() => of('Unknown User'))
    );
  }
}