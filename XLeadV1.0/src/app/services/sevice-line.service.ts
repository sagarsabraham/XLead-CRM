import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface ServiceType {
  id: number;
  serviceName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeviceLineService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getServiceTypes(): Observable<ServiceType[]> {
    const url = `${this.apiUrl}/api/Serviceline`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<ServiceType[]>> = this.http.get<ApiResponse<ServiceType[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}