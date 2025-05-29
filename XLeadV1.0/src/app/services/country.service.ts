import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Country {
  id: number;
  countryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = environment.apiUrl;
    
  constructor(private http: HttpClient) { }
  
  getCountries(): Observable<Country[]> {
    // Add the full path here
    const url = `${this.apiUrl}/api/Country`;
    console.log('Calling API at:', url);
    return this.http.get<Country[]>(url);
  }
}
