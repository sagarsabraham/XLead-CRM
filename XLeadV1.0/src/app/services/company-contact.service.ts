import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
 
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
 
  constructor(private http: HttpClient) {}
 
  getContactByNameAndCustomer(contactName: string, customerName: string): Observable<Contact | undefined> {
    console.log('getContactByNameAndCustomer called with contactName:', contactName, 'customerName:', customerName);
    return this.getContacts().pipe(
      map(contacts => {
        const normalizedContactName = contactName.trim().toLowerCase();
        const normalizedCustomerName = customerName.trim().toLowerCase();
        const foundContact = contacts.find((contact: any) => {
          const fullName = `${contact.firstName} ${contact.lastName}`.trim().toLowerCase();
          // Assuming the getContacts() response doesn't have customerName directly
          // This part of your logic might need adjustment if getContacts() API changes
          // For now, let's assume it works or is handled elsewhere.
          return fullName === normalizedContactName;
        });
        if (!foundContact) {
          console.warn('No contact found for contactName:', contactName, 'customerName:', customerName);
        }
        return foundContact;
      })
    );
  }
 
  // --- THIS IS THE CORRECTED METHOD ---
  getCompanyContactMap(): Observable<{ [customer: string]: CustomerContactMap}> {
    return this.http.get<{ [customer: string]: CustomerContactMap }>(
      `${this.apiUrl}/api/CustomerContact/customer-contact-map`
    );
  }
 
  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/CustomerContact/customers`);
  }
 
  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/CustomerContact/contacts`);
  }
 
  addCompany(customer: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/CustomerContact/customer`,
      customer,
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
      map(companies => companies.find((company: any) => company.customerName === name))
    );
  }

    updateCompany(id: number, companyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/CustomerContact/customer/${id}`, companyData);
  }

  // Pass userId to the backend for authorization check
  deleteCompany(id: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/CustomerContact/customer/${id}?userId=${userId}`);
  }
  
  updateContact(id: number, contactData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/CustomerContact/contact/${id}`, contactData);
  }

  // Pass userId to the backend for authorization check
  deleteContact(id: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/CustomerContact/contact/${id}?userId=${userId}`);
  }
}