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
  [customerName: string]: string[]; 
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
          const contactCustomerName = contact.customerName?.trim().toLowerCase();
          return fullName === normalizedContactName && contactCustomerName === normalizedCustomerName;
        });
        if (!foundContact) {
          console.warn('No contact found for contactName:', contactName, 'customerName:', customerName);
        }
        return foundContact;
      })
    );
  }

  getCompanyContactMap(): Observable<{ [customer: string]: string[] }> {
    return this.http.get<{ [customer: string]: string[] }>(
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
   updateContact(id: number, contactData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/CustomerContact/contact/${id}`, contactData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
    deleteContact(id: number): Observable<any> {
    // The userId parameter is no longer needed
    return this.http.delete(`${this.apiUrl}/api/CustomerContact/contact/${id}`);

  }
   updateCompany(id: number, companyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/CustomerContact/customer/${id}`, companyData);
    
  }

    deleteCompany(id: number): Observable<any> {
   
    return this.http.delete(`${this.apiUrl}/api/CustomerContact/customer/${id}`);
    
    } 

}