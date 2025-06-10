import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface RevenueType {
  id: number;
  revenueTypeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenuetypeService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getRevenueTypes(): Observable<RevenueType[]> {
    const url = `${this.apiUrl}/api/RevenueType`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<RevenueType[]>> = this.http.get<ApiResponse<RevenueType[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}