import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
interface IndustryVertical {
  id: number;
  industryName: string;
}
@Injectable({
  providedIn: 'root'
})
export class IndustryVerticalService {

   private apiUrl = environment.apiUrl;
    
    constructor(private http: HttpClient) { }
    
    getIndustryVertical(): Observable<IndustryVertical[]> {
  
      const url = `${this.apiUrl}/api/IndustryVertical`;
      console.log('Calling API at:', url);
      return this.http.get<IndustryVertical[]>(url);
    }
}
