import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface IndustryVertical {
  id: number;
  industryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndustryVerticalService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getIndustryVertical(): Observable<IndustryVertical[]> {
    const url = `${this.apiUrl}/api/IndustryVertical`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<IndustryVertical[]>> = this.http.get<ApiResponse<IndustryVertical[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}