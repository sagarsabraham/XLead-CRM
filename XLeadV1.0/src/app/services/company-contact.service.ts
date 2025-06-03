
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
export interface Company {
  companyName: string;
  phoneNo: string;
  website: string;
  industryVertical:string;
}

export interface Contact {
  FirstName: string;
  LastName: string;
  companyName: string;
  Email: string;
  phoneNo: string;
}

export interface ContactCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  createdBy: number;
}
export interface CompanyContactMap {
  [companyName: string]: string[]; 
}
@Injectable({
  providedIn: 'root'
})
export class CompanyContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompanyContactMap(): Observable<{ [company: string]: string[] }> {
    return this.http.get<{ [company: string]: string[] }>(
      `${this.apiUrl}/api/CompanyContact/company-contact-map`
    );
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/CompanyContact/companies`);
  }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/CompanyContact/contacts`);
  }

  addCompany(company: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/CompanyContact/company`,
      company,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  addContact(contact: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/CompanyContact/contact`,
      contact,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  getCompanyByName(name: string): Observable<any> {
    return this.getCompanies().pipe(
      map(companies => companies.find((company: any) => company.companyName === name))
    );
  }
}
