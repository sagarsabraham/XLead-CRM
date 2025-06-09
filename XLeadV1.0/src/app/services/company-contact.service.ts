import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthServiceService } from './auth-service.service';

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
export interface CustomerUpdatePayload { 
  customerName: string;
  customerPhoneNumber?: string | null;
  website?: string | null;
  industryVerticalId?: number | null;
  isActive: boolean;
  UpdatedBy: number; 
}

export interface ContactUpdatePayload {
  firstName: string;
  lastName?: string | null;
  designation?: string | null;
  email: string;
  phoneNumber?: string | null;
  isActive: boolean;
   UpdatedBy: number; 
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

  constructor(private http: HttpClient,
    private authService: AuthServiceService
  ) {}

 getContactByNameAndCustomer(contactName: string, customerName: string): Observable<Contact | undefined> {
    const currentUserId = this.authService.getUserId();
    if (!currentUserId) {
      console.error('CompanyContactService: User ID not available for getContactByNameAndCustomer.');
      return throwError(() => new Error('User context not found.'));
    }
    console.log('getContactByNameAndCustomer called for user:', currentUserId, 'contactName:', contactName, 'customerName:', customerName);

    return this.getContacts(currentUserId).pipe( 
      map(contacts => {
        const normalizedContactName = contactName.trim().toLowerCase();
        
        const foundContact = contacts.find((contact: any) => { 
          const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim().toLowerCase();
        
          return fullName === normalizedContactName && contact.customerName === customerName; 
        });
        if (!foundContact) {
          console.warn('No contact found for contactName:', contactName, 'within customer:', customerName, 'for user:', currentUserId);
        }
        return foundContact;
      })
    );
  }


  getCompanyContactMap(): Observable<{ [customer: string]: CustomerContactMap}> {
    return this.http.get<{ [customer: string]: CustomerContactMap }>(
      `${this.apiUrl}/api/CustomerContact/customer-contact-map`
    );
  }

 getCompanies(requestingUserId: number): Observable<any[]> { 
 
  return this.http.get<any[]>(`${this.apiUrl}/api/CustomerContact/customers/${requestingUserId}`);
}

getContacts(requestingUserId: number): Observable<any[]> { 

  return this.http.get<any[]>(`${this.apiUrl}/api/CustomerContact/contacts/${requestingUserId}`);
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
    return this.getCompanies(this.authService.getUserId()).pipe(
      map(companies => companies.find((company: any) => company.customerName === name))
    );
  }

  updateCompany(id: number, companyData: CustomerUpdatePayload): Observable<any> { 
  return this.http.put(`${this.apiUrl}/api/CustomerContact/customer/${id}`, companyData);
}

deleteCompany(id: number): Observable<any> {
  const performingUserId = this.authService.getUserId();
  return this.http.delete(`${this.apiUrl}/api/CustomerContact/customer/${id}?performingUserId=${performingUserId}`);
}

updateContact(id: number, contactData: ContactUpdatePayload): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/CustomerContact/contact/${id}`, contactData, {  });
}

deleteContact(id: number): Observable<any> {
  const performingUserId = this.authService.getUserId();
  return this.http.delete(`${this.apiUrl}/api/CustomerContact/contact/${id}?performingUserId=${performingUserId}`);
}
  
}