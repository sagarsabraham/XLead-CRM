import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Imports for the new standardization pattern ---
import { ApiResponseService } from './apiresponse.service'; // Corrected path and filename
import { ApiResponse } from '../models/api-response.model';

// --- Interface Definitions (No changes needed here) ---
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

  // --- KEY CHANGE 1: Inject both HttpClient and our new ApiResponseService ---
  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) {}

  // --- Methods that depend on other methods (No internal changes needed!) ---
  // These work because the methods they call (e.g., getContacts) are now refactored
  // to return the unwrapped data, so the `map` operator receives what it expects.
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

  // --- Refactored methods that make direct API calls ---

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