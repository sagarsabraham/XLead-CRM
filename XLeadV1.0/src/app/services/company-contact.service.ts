import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

import { ApiResponseService } from './apiresponse.service'; 
import { ApiResponse } from '../models/api-response.model';

export interface Customer {
  customerName: string;
  phoneNo: string;
  website: string;
  industryVerticalId: number | null;
  countryCode: string;
  createdBy: number;
}

export interface Contact {
  firstName: string;
  lastName: string;
  designation: string;
  customerName: string;
  email: string;
  phoneNo: string;
  countryCode?: string;
  createdBy: number;
}

export interface ContactCreateDto {
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  phoneNumber: string;
  customerName: string;
  createdBy: number;
}

export interface CustomerContactMap {
  isActive: boolean;
  isHidden: boolean | null;
  contacts: string[];
}


@Injectable({
  providedIn: 'root'
})
export class CompanyContactService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) {}
  getContactByNameAndCustomer(contactName: string, customerName: string): Observable<Contact | undefined> {
    console.log('getContactByNameAndCustomer called with contactName:', contactName, 'customerName:', customerName);
    return this.getContacts().pipe(
      map(contacts => {
        const normalizedContactName = contactName.trim().toLowerCase();
        const foundContact = contacts.find((contact: any) => {
          const fullName = `${contact.firstName} ${contact.lastName}`.trim().toLowerCase();
          return fullName === normalizedContactName;
        });
        if (!foundContact) {
          console.warn('No contact found for contactName:', contactName, 'customerName:', customerName);
        }
        return foundContact;
      })
    );
  }

  getCompanyByName(name: string): Observable<any> {
    return this.getCompanies().pipe(
      map(companies => companies.find((company: any) => company.customerName === name))
    );
  }


  getCompanyContactMap(): Observable<{ [customer: string]: CustomerContactMap }> {
    const source$ = this.http.get<ApiResponse<{ [customer: string]: CustomerContactMap }>>(
      `${this.apiUrl}/api/CustomerContact/customer-contact-map`
    );
    return this.apiResponseService.handleResponse(source$);
  }

  getCompanies(): Observable<any[]> {
    const source$ = this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/api/CustomerContact/customers`);
    return this.apiResponseService.handleResponse(source$);
  }

  getContacts(): Observable<any[]> {
    const source$ = this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/api/CustomerContact/contacts`);
    return this.apiResponseService.handleResponse(source$);
  }

  addCompany(customer: any): Observable<any> {
    const source$ = this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/api/CustomerContact/customer`,
      customer,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
    return this.apiResponseService.handleResponse(source$);
  }

  addContact(contact: any): Observable<any> {
    const source$ = this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/api/CustomerContact/contact`,
      contact,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
    return this.apiResponseService.handleResponse(source$);
  }

  updateCompany(id: number, companyData: any): Observable<any> {
    const source$ = this.http.put<ApiResponse<any>>(`${this.apiUrl}/api/CustomerContact/customer/${id}`, companyData);
    return this.apiResponseService.handleResponse(source$);
  }

  deleteCompany(id: number, userId: number): Observable<any> {
    const source$ = this.http.delete<ApiResponse<any>>(`${this.apiUrl}/api/CustomerContact/customer/${id}?userId=${userId}`);
    return this.apiResponseService.handleResponse(source$);
  }
  
  updateContact(id: number, contactData: any): Observable<any> {
    const source$ = this.http.put<ApiResponse<any>>(`${this.apiUrl}/api/CustomerContact/contact/${id}`, contactData);
    return this.apiResponseService.handleResponse(source$);
  }

  deleteContact(id: number, userId: number): Observable<any> {
    const source$ = this.http.delete<ApiResponse<any>>(`${this.apiUrl}/api/CustomerContact/contact/${id}?userId=${userId}`);
    return this.apiResponseService.handleResponse(source$);
  }
}