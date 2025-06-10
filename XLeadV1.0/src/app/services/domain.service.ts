import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface Domain {
  id: number;
  domainName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getAllDomains(): Observable<Domain[]> {
    const url = `${this.apiUrl}/api/Domain`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<Domain[]>> = this.http.get<ApiResponse<Domain[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}