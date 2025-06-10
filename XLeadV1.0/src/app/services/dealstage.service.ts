import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface DealStage {
  id: number;
  displayName?: string;
  stageName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DealstageService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }
  
  getAllDealStages(): Observable<DealStage[]> {
    const url = `${this.apiUrl}/api/DealStage`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<DealStage[]>> = this.http.get<ApiResponse<DealStage[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}