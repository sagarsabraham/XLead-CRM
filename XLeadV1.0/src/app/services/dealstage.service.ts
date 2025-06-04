import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface DealStage {
  id: number;
  displayName?: string;
  stageName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DealstageService {

  private apiUrl = environment.apiUrl;
        
  constructor(private http: HttpClient) { }
  
  getAllDealStages(): Observable<DealStage[]> {
    // Add the full path here
    const url = `${this.apiUrl}/api/DealStage`;
    console.log('Calling API at:', url);
    return this.http.get<DealStage[]>(url);
  }
}
