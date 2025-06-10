import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface Region {
  id: number;
  regionName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getAllRegions(): Observable<Region[]> {
    const url = `${this.apiUrl}/api/Region`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<Region[]>> = this.http.get<ApiResponse<Region[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}