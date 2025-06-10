import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getContacts(): Observable<any[]> {
    const source$: Observable<ApiResponse<any[]>> = 
      this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/api/CustomerContact/contacts`);
    return this.apiResponseService.handleResponse(source$);
  }
}