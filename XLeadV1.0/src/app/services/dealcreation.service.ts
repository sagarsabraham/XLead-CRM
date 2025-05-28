// src/app/services/deal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define an interface for the Deal data structure expected by the backend (DealCreateDto.cs)
export interface DealCreatePayload {
  title: string;
  amount: number;
  companyName: string;
  contactFullName: string;
  salespersonName?: string | null; // Optional as per previous change
  accountId?: number | null;
  regionId: number;
  domainId?: number | null;
  dealStageId: number;
  revenueTypeId: number;
  duId: number;
  countryId: number;
  description: string;
  probability?: number | null;
  startingDate: string; // ISO string format
  closingDate: string; // ISO string format
  createdBy: number;
}

// Define an interface for the Deal data structure returned by the backend (DealReadDto.cs)
export interface DealRead {
  id: number;
  dealName: string; // Maps to PipelineDeal.title
  dealAmount: number; // Maps to PipelineDeal.amount
  salespersonName?: string | null; // <<<--- ADDED/CORRECTED (make optional if backend can omit it)
  accountId?: number | null;
  accountName?: string | null;
  regionId?: number | null;
  regionName?: string | null;
  domainId?: number | null;
  domainName?: string | null;
  revenueTypeId?: number | null;
  revenueTypeName?: string | null;
  duId?: number | null;
  duName?: string | null; // Should be duName to match casing, not DUName
  countryId?: number | null;
  countryName?: string | null;
  description?: string | null;
  probability?: number | null;
  dealStageId?: number | null;
  stageName?: string | null; // Used to assign deal to a pipeline stage
  contactId: number; // Assuming contact is always present
  contactName?: string | null;
  startingDate?: string | null; // ISO string from backend
  closingDate?: string | null;  // <<<--- CORRECTED CASING (if it was 'closeDate' before) / ENSURE PRESENT
  createdBy: number;
  createdAt: string; // ISO string
  // This field was an error, it belongs to PipelineDeal not DealRead
  // originalData?: DealRead; // REMOVE THIS IF IT WAS HERE
  companyName?: string; // If your DealReadDto has a direct companyName field from a join
}


@Injectable({
  providedIn: 'root'
})
export class DealService {
  private apiUrl = 'https://localhost:7297/api/deals'; // Example: Update
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) { }

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

  // Basic error handling
  private handleError(error: HttpErrorResponse) {
    // ... (your existing handleError logic) ...
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