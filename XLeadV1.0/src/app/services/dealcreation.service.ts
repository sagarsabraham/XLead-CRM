// src/app/services/deal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define an interface for the Deal data structure expected by the backend
// This should match your DealCreateDto.cs
export interface DealCreatePayload {
  title: string;
  amount: number;
  companyName: string;
  contactFullName: string;
  // salespersonName: string;
  accountId?: number | null; // Optional fields are nullable
  regionId: number; // Assuming required based on DTO
  domainId?: number | null;
  dealStageId: number; // Assuming required
  revenueTypeId: number; // Assuming required
  duId: number; // Assuming required
  countryId: number; // Assuming required
  description: string;
  probability?: number | null;
  startingDate: string; // ISO string format
  closingDate: string; // ISO string format
  createdBy: number;
}

// Define an interface for the Deal data structure returned by the backend
// This should match your DealReadDto.cs
export interface DealRead {
  id: number;
  dealName: string;
  dealAmount: number;
  
  accountId?: number | null;
  accountName?: string | null;
  regionId?: number | null;
  regionName?: string | null;
  domainId?: number | null;
  domainName?: string | null;
  revenueTypeId?: number | null;
  revenueTypeName?: string | null;
  duId?: number | null;
  duName?: string | null; // Corrected from DUName to duName to match typical JS/TS casing
  countryId?: number | null;
  countryName?: string | null;
  description?: string | null;
  probability?: number | null;
  dealStageId?: number | null;
  stageName?: string | null;
  contactId: number;
  contactName?: string | null;
  startingDate?: string | null; // ISO string
  closingDate?: string | null; // ISO string
  createdBy: number;
  createdAt: string; // ISO string
}


@Injectable({
  providedIn: 'root' // Registers the service at the root level
})
export class DealService {
  // Adjust the apiUrl to your backend's base URL
  private apiUrl = 'https://localhost:7297/api/Deals'; // Example: Update with your actual backend URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Add other headers like Authorization if needed:
      // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Creates a new deal.
   * @param dealData The data for the new deal.
   * @returns An Observable of the created deal.
   */
  createDeal(dealData: DealCreatePayload): Observable<DealRead> {
    return this.http.post<DealRead>(this.apiUrl, JSON.stringify(dealData), this.httpOptions)
      .pipe(
        map(response => {
          // You can transform the response here if needed
          // e.g., convert date strings to Date objects if your components expect them
          return {
            ...response,
            // Example: Convert date strings from backend to Date objects
            // startingDate: response.startingDate ? new Date(response.startingDate) : null,
            // closingDate: response.closingDate ? new Date(response.closingDate) : null,
            // createdAt: new Date(response.createdAt),
          };
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Gets a deal by its ID.
   * @param id The ID of the deal.
   * @returns An Observable of the deal.
   */
  getDealById(id: number): Observable<DealRead> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<DealRead>(url, this.httpOptions)
      .pipe(
        map(response => {
          // Optional: transform dates from ISO strings to Date objects
          return {
            ...response,
            // startingDate: response.startingDate ? new Date(response.startingDate) : null,
            // closingDate: response.closingDate ? new Date(response.closingDate) : null,
            // createdAt: new Date(response.createdAt),
          };
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Gets all deals.
   * @returns An Observable array of deals.
   */
  getAllDeals(): Observable<DealRead[]> {
    return this.http.get<DealRead[]>(this.apiUrl, this.httpOptions)
      .pipe(
        map(deals => deals.map(deal => {
          // Optional: transform dates for each deal
          return {
            ...deal,
            // startingDate: deal.startingDate ? new Date(deal.startingDate) : null,
            // closingDate: deal.closingDate ? new Date(deal.closingDate) : null,
            // createdAt: new Date(deal.createdAt),
          };
        })),
        catchError(this.handleError)
      );
  }


  // Basic error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      // The response body may contain clues as to what went wrong
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: `, error.error); // Log the full error object

      if (error.status === 400 && error.error && typeof error.error === 'object') {
        // Handle validation errors from ASP.NET Core
        const validationErrors = error.error.errors || error.error; // ASP.NET Core validation errors structure
        let messages = [];
        for (const key in validationErrors) {
          if (validationErrors.hasOwnProperty(key)) {
            messages.push(...validationErrors[key]);
          }
        }
        errorMessage = `Validation Errors: ${messages.join(', ')}`;
        if (messages.length === 0 && error.error.title) { // Fallback for general 400
             errorMessage = error.error.title;
        }
         if (messages.length === 0 && typeof error.error === 'string') {
            errorMessage = error.error;
        }


      } else if (error.status === 0) {
          errorMessage = 'Could not connect to the server. Please check your network connection or if the server is running.';
      }
      else {
          errorMessage = `Server error: ${error.status} - ${error.message || error.statusText}`;
          if (error.error && typeof error.error === 'string') {
              errorMessage += ` Details: ${error.error}`;
          } else if (error.error && error.error.detail) { // For ProblemDetails
              errorMessage += ` Details: ${error.error.detail}`;
          }
      }
    }
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}