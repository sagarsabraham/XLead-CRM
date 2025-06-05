// src/app/services/deal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service';
 

export interface DealCreatePayload {
  title: string;
  amount: number;
  customerName: string;
  contactFullName: string;
  contactEmail: string | null; 
  contactPhoneNumber: string | null; // Updated to allow null
  contactDesignation: string | null; // Updated to allow null
  accountId: number | null;
  serviceId: number | null;
  regionId: number;
  domainId: number | null;
  dealStageId: number;
  revenueTypeId: number;
  duId: number;
  countryId: number;
  description: string;
  probability: number | null;
  startingDate: string;
  closingDate: string;
  createdBy: number;
  customFields?: { [key: string]: any };
}

export interface DealRead {
  id: number;
  dealName: string;
  dealAmount: number;
  customerName?: string;
  contactName?: string;
  salespersonName?: string | null;
  startingDate?: string | null;
  closingDate?: string | null;
  regionName?: string;
  regionId?: number;
  domainName?: string;
  domainId?: number | null;
  stageName?: string;
  dealStageId?: number;
  revenueTypeName?: string;
  revenueTypeId?: number;
  duName?: string;
  duId?: number;
  countryName?: string;
  countryId?: number;
  description?: string;
  probability?: number | null;
  accountName?: string;
  accountId?: number | null;
  serviceName?: string;
  serviceId?: number | null;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  customFields?: { [key: string]: any };
}
export interface StageHistoryReadDto {
  id: number;
  dealId: number;
  stageName: string;
  createdBy: number; // This is the userId
  createdAt: string; // ISO date string
  updatedBy?: number | null;
  updatedAt?: string | null;
}
 
@Injectable({
  providedIn: 'root'
})
export class DealService {
  private apiUrl = 'https://localhost:7297/api/Deals';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
 
  constructor(private http: HttpClient,private authService: AuthServiceService) { }
 
  createDeal(dealData: DealCreatePayload): Observable<DealRead> {
    return this.http.post<DealRead>(this.apiUrl, JSON.stringify(dealData), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getDealById(id: number): Observable<DealRead> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<DealRead>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
 
  getAllDeals(): Observable<DealRead[]> {
    return this.http.get<DealRead[]>(this.apiUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getDealsForCurrentUser(): Observable<DealRead[]> {
    const currentUserId = this.authService.getUserId(); // Get the hardcoded userId (e.g., 6)

    if (!currentUserId) {
      // This should ideally not happen if AuthServiceService always provides a userId
      console.error('User ID not found in AuthServiceService.');
      return throwError(() => new Error('User ID is not available. Cannot fetch user-specific deals.'));
    }

    // Construct the URL for the specific endpoint
    const url = `${this.apiUrl}/byCreator/${currentUserId}`;
    
    // Optional: Client-side privilege check (if you have one like 'ViewOwnDeals')
    // if (!this.authService.hasPrivilege('ViewOwnDeals')) {
    //   return throwError(() => new Error('User lacks privilege to view their own deals.'));
    // }

    console.log(`Fetching deals for user ID: ${currentUserId} from URL: ${url}`);
    return this.http.get<DealRead[]>(url, this.httpOptions) // No body needed for GET
      .pipe(catchError(this.handleError));
  }
  updateDealStage(id: number, stageName: string): Observable<DealRead> { // Return single DealReadDto
    const url = `${this.apiUrl}/${id}/stage`;
    const userId = this.authService.getUserId();

    if (!userId) {
      // This check is good for immediate feedback, but the backend must re-validate
      return throwError(() => new Error('User ID not found. Cannot perform action.'));
    }

    // Client-side privilege check (optional, backend MUST enforce this)
    if (!this.authService.hasPrivilege('StageUpdate')) {
      return throwError(() => new Error('User lacks StageUpdate privilege.'));
    }

    const payload = {
      stageName: stageName,
      performedByUserId: userId // <--- CHANGED FROM updatedBy to match backend DTO
    };

    // HttpClient stringifies the object by default when Content-Type is application/json
    return this.http.put<DealRead>(url, payload, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // NEW: getDealStageHistory
  getDealStageHistory(dealId: number): Observable<StageHistoryReadDto[]> {
    const url = `${this.apiUrl}/${dealId}/history`;
    // Add privilege check if viewing history requires one, e.g., 'ViewDealHistory'
    // if (!this.authService.hasPrivilege('ViewDealHistory')) { // Example
    //   return throwError(() => new Error('User lacks privilege to view history.'));
    // }
    return this.http.get<StageHistoryReadDto[]>(url)
      .pipe(catchError(this.handleError));
  }



  private handleError(error: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      if (error.status === 400 && error.error && typeof error.error === 'object') {
        const validationErrors = error.error.errors || error.error;
        let messages = [];
        for (const key in validationErrors) {
          if (validationErrors.hasOwnProperty(key)) { messages.push(...validationErrors[key]); }
        }
        errorMessage = `Validation Errors: ${messages.join(', ')}`;
        if (messages.length === 0 && error.error.title) { errorMessage = error.error.title; }
        if (messages.length === 0 && typeof error.error === 'string') { errorMessage = error.error; }
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please check your network connection or if the server is running.';
      } else {
        errorMessage = `Server error: ${error.status} - ${error.message || error.statusText}`;
        if (error.error && typeof error.error === 'string') { errorMessage += ` Details: ${error.error}`; }
        else if (error.error && error.error.detail) { errorMessage += ` Details: ${error.error.detail}`; }
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
 