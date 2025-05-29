// src/app/services/domain.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  getDomains(): Observable<Domain[]> {
    const url = `${this.apiUrl}/api/Domain`;
    return this.http.get<Domain[]>(url);
  }
}