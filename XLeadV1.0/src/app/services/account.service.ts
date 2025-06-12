import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseService } from 'src/app/services/apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

interface Account {
  id: number;
  accountName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }
  
  getAllAccounts(): Observable<Account[]> {
    const url = `${this.apiUrl}/api/Account`;
    console.log('Calling API at:', url);

    const source$: Observable<ApiResponse<Account[]>> = this.http.get<ApiResponse<Account[]>>(url);

    return this.apiResponseService.handleResponse(source$);
  }
}