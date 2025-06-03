import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Privilege {
  id: number;
  privilegeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrivilegeServiceService {
  private baseUrl = 'https://localhost:7297/api/UserPrivileges';

  constructor(private http: HttpClient) {}

  getPrivileges(userId: number): Observable<Privilege[]> {
    return this.http.get<Privilege[]>(`${this.baseUrl}/${userId}`);
  }
}