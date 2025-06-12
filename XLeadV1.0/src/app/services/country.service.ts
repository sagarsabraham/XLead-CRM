import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface Country {
  id: number;
  countryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }
  
  getCountries(): Observable<Country[]> {
    const url = `${this.apiUrl}/api/Country`;
    console.log('Calling API at:', url);
    const source$: Observable<ApiResponse<Country[]>> = this.http.get<ApiResponse<Country[]>>(url);
    return this.apiResponseService.handleResponse(source$);
  }
}