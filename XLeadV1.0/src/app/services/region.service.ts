import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Region {
  id: number;
  regionName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private apiUrl = environment.apiUrl;
            
      constructor(private http: HttpClient) { }
      
      getAllRegions(): Observable<Region[]> {
        // Add the full path here
        const url = `${this.apiUrl}/api/Region`;
        console.log('Calling API at:', url);
        return this.http.get<Region[]>(url);
      }
}
