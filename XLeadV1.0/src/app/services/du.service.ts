import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface DU {
  id: number;
  duName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DuService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }
  
  getDU(): Observable<DU[]> {
    const url = `${this.apiUrl}/api/Du`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<DU[]>> = this.http.get<ApiResponse<DU[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}