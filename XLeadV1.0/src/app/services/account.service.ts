import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Account {
  id: number;
  accountName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = environment.apiUrl;
      
    constructor(private http: HttpClient) { }
    
    getAllAccounts(): Observable<Account[]> {
      // Add the full path here
      const url = `${this.apiUrl}/api/Account`;
      console.log('Calling API at:', url);
      return this.http.get<Account[]>(url);
    }
}
