import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RelatedInfoService {
  private apiUrl = 'http://localhost:3000/api/deal_info';

  constructor(private http : HttpClient) { }
  
  getDeals() {
    return this.http.get(this.apiUrl);
  }
}
