import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Domain {
  id: number;
  domainName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  private apiUrl = environment.apiUrl;
          
    constructor(private http: HttpClient) { }
    
    getAllDomains(): Observable<Domain[]> {
      // Add the full path here
      const url = `${this.apiUrl}/api/Domain`;
      console.log('Calling API at:', url);
      return this.http.get<Domain[]>(url);
    }
}
