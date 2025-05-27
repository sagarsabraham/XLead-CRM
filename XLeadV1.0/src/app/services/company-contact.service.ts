import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CompanyContactService {
  private apiUrl = 'https://localhost:7297/api/CompanyContact'
; // Replace with your real API

  constructor(private http: HttpClient) {}

  getCompanyContactMap(): Observable<{ [company: string]: string[] }> {
    return this.http.get<{ [company: string]: string[] }>(`${this.apiUrl}/company-contact-map`);
  }
addCompany(company: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/company`, company, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  });
}
 getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contacts`);
  }
 getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/companies`);
  }
  addContact(contact: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, contact,{
       headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  });
  }
  getCompanyByName(name: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/companies`).pipe(
    map(companies => companies.find((company: any) => company.companyName === name))
  );
}
}