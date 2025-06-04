
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
// src/app/services/company-contact.service.ts
export interface Company {
  companyName: string;
  phoneNo: string; // Without country code (handled separately in modal)
  website: string;
  industryVerticalId: number | null; // Updated to match backend
  countryCode: string; // Added to handle country code
  createdBy: number;
}

export interface Contact {
  firstName: string;
  lastName: string;
  designation: string; // Added to match backend
  companyName: string;
  email: string;
  phoneNo: string; // Without country code (handled separately in modal)
  countryCode?: string; // Added to handle country code (optional for compatibility)
  createdBy: number;
}

export interface ContactCreateDto {
  firstName: string;
  lastName: string;
  designation: string; 
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

getContactByNameAndCompany(contactName: string, companyName: string): Observable<Contact | undefined> {
  return this.getContacts().pipe(
    map(contacts => contacts.find((contact: any) => 
      `${contact.firstName} ${contact.lastName}`.trim() === contactName && 
      contact.customerName === companyName
    ))
  );
}
  getCompanyContactMap(): Observable<{ [company: string]: string[] }> {
    return this.http.get<{ [company: string]: string[] }>(
      `${this.apiUrl}/api/CustomerContact/customer-contact-map`
    );
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/CustomerContact/customers`);
  }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/CustomerContact/contacts`);
  }

  addCompany(company: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/CustomerContact/customer`,
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
      `${this.apiUrl}/api/CustomerContact/contact`,
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
