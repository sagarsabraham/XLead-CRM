// src/app/services/account.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Account {
  id: number;
  accountName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // Remove /api/Account from here - it will be added in the getAccounts method
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<Account[]> {
    // Add the full path here
    const url = `${this.apiUrl}/api/Account`;
    console.log('Calling API at:', url);
    return this.http.get<Account[]>(url);
  }
}