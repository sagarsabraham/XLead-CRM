import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface RevenueType {
  id: number;
  revenueTypeName: string;
}

@Injectable({
  providedIn: 'root'
})

export class RevenuetypeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRevenueTypes(): Observable<RevenueType[]> {
    // Add the full path here
    const url = `${this.apiUrl}/api/RevenueType`;
    console.log('Calling API at:', url);
    return this.http.get<RevenueType[]>(url);
  }
}
 
