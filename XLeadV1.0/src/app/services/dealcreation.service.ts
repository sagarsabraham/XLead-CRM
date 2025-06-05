// src/app/services/deal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface DealCreatePayload {
  title: string;
  amount: number;
  customerName: string; // Note: In previous backend versions, we used 'companyName'. Ensure backend DTO matches.
  contactFullName: string;
  contactEmail: string | null;
  contactPhoneNumber: string | null;
  contactDesignation: string | null;
  accountId: number | null;
  serviceId: number | null; // New field
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
  closingDate?: string | null; // If backend always returns this, can be non-nullable: string
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
  serviceName?: string; // New field
  serviceId?: number | null; // New field
  createdBy?: number;
  createdAt?: string; // Should be non-nullable if backend always sends it
  updatedAt?: string;
  customFields?: { [key: string]: any };
}

// --- START: Added for Dashboard Metrics ---
export interface DashboardMetricItem {
  value: string;
  percentageChange: number;
  isPositiveTrend: boolean;
}

export interface DashboardMetrics {
  openPipelines: DashboardMetricItem;
  pipelinesWon: DashboardMetricItem;
  pipelinesLost: DashboardMetricItem;
  revenueWon: DashboardMetricItem;
}
// --- END: Added for Dashboard Metrics ---

export interface PipelineStageData {
  stageName: string; // Matches StageName from PipelineStageDataDto
  totalAmount: number; // Matches TotalAmount from PipelineStageDataDto (number is appropriate for decimal from C#)
}

@Injectable({
  providedIn: 'root'
})
export class DealService {
  private apiUrl = 'https://localhost:7297/api/Deals'; // Base API URL for deals
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

  updateDealStage(id: number, stageName: string): Observable<DealRead[]> { // Consider if this should return DealRead or just a success/failure
    const url = `${this.apiUrl}/${id}/stage`;
    // The backend for updateDealStage might expect a specific DTO.
    // For example: { "newStageId": 123 } or { "newStageName": "Qualification" }
    // The current payload {"stageName":stageName} is a common pattern.
    return this.http.put<DealRead[]>(url, JSON.stringify({ "stageName": stageName }), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // --- START: Added for Dashboard Metrics ---
  getDashboardMetrics(): Observable<DashboardMetrics> {
    const url = `${this.apiUrl}/dashboard-metrics`; // Endpoint defined in DealsController.cs
    return this.http.get<DashboardMetrics>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  // --- END: Added for Dashboard Metrics ---

    getOpenPipelineAmountsByStage(): Observable<PipelineStageData[]> {
    const url = `${this.apiUrl}/open-pipeline-stages`;
    return this.http.get<PipelineStageData[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);

      if (error.status === 400) {
        // ASP.NET Core validation errors often come in `error.error.errors`
        // or sometimes directly in `error.error` as a string or ProblemDetails object
        if (error.error && typeof error.error === 'object') {
          if (error.error.errors) { // Standard ASP.NET Core validation summary
            const validationErrors = error.error.errors;
            let messages = [];
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                messages.push(...validationErrors[key]);
              }
            }
            errorMessage = `Validation Errors: ${messages.join(', ')}`;
          } else if (error.error.title) { // ProblemDetails
            errorMessage = error.error.title;
            if (error.error.detail) {
                errorMessage += ` Details: ${error.error.detail}`;
            }
          } else if (typeof error.error === 'string') { // Custom string error from BadRequest(string)
             errorMessage = error.error;
          } else {
            // Fallback for other 400 error structures
            errorMessage = `Bad Request (Status 400). Please check your input.`;
            if (Object.keys(error.error).length > 0) {
                try {
                    errorMessage += ` Details: ${JSON.stringify(error.error)}`;
                } catch (e) { /* ignore if not stringifiable */ }
            }
          }
        } else if (typeof error.error === 'string') { // Sometimes 400 errors are just strings
            errorMessage = error.error;
        } else {
            errorMessage = `Bad Request (Status 400).`;
        }
      } else if (error.status === 0 || error.status === 503) { // Network error or service unavailable
        errorMessage = 'Could not connect to the server. Please check your network connection or if the server is running.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden. You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
         if (error.error && typeof error.error === 'string') { errorMessage += ` Details: ${error.error}`; }
      } else { // Other server-side errors
        errorMessage = `Server error: ${error.status} - ${error.message || error.statusText}`;
        if (error.error && typeof error.error === 'string') {
          errorMessage += ` Details: ${error.error}`;
        } else if (error.error && error.error.detail) { // ProblemDetails
          errorMessage += ` Details: ${error.error.detail}`;
        } else if (error.error && error.error.title) { // ProblemDetails
           errorMessage += ` Title: ${error.error.title}`;
        }
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}