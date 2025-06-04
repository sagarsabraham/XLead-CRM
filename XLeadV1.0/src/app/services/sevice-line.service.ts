import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
interface ServiceType {
  id: number;
  serviceName: string;
}
@Injectable({
  providedIn: 'root'
})
export class SeviceLineService {

  private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }
  
    getServiceTypes(): Observable<ServiceType[]> {
     
      const url = `${this.apiUrl}/api/Serviceline`;
      console.log('Calling API at:', url);
      return this.http.get<ServiceType[]>(url);
    }
}
