import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

export interface Privilege {
  id: number;
  privilegeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrivilegeServiceService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) {}

  getPrivileges(userId: number): Observable<Privilege[]> {
    const source$: Observable<ApiResponse<Privilege[]>> = 
      this.http.get<ApiResponse<Privilege[]>>(`${this.apiUrl}/api/UserPrivileges/${userId}`);
    return this.apiResponseService.handleResponse(source$);
  }
}