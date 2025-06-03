
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Privilege {
  id: number;
  privilegeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrivilegeServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPrivileges(userId: number): Observable<Privilege[]> {
    return this.http.get<Privilege[]>(`${this.apiUrl}/api/UserPrivileges/${userId}`);
  }
}
