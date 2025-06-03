import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface DU {
  id: number;
  duName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DuService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  getDU(): Observable<DU[]> {
    
    const url = `${this.apiUrl}/api/Du`;
    console.log('Calling API at:', url);
    return this.http.get<DU[]>(url);
  }
}
