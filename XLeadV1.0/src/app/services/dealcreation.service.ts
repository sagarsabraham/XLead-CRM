
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
  contactPhoneNumber: string | null; 
  contactDesignation: string | null; 
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
export interface DealManagerOverview { 
  id: number;
  dealName: string;
  dealAmount: number;
  stageName?: string;
  closingDate?: string | null;
  salespersonId: number;
  salespersonName: string;


  accountName?: string;
  regionName?: string;
  duName?: string; 
  contactName?: string;
  startingDate?: string | null;
}


export interface ManagerStageCount {
  stageName: string;
  dealCount: number;
 
}
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

export interface PipelineStageData { 
  stageName: string;
  totalAmount: number;
}

export interface MonthlyRevenueData { 
  monthYear: string;
  totalRevenue: number;
}

export interface TopCustomerData { 
  customerName: string;
  totalRevenueWon: number;
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
  createdBy: number;
  createdAt: string; 
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
  getManagerOverviewDeals(managerId: number): Observable<DealManagerOverview[]> {
    if (!this.authService.hasPrivilege('overview')) { 
        return throwError(() => new Error('Current user lacks Overview privilege.'));
    }
    const url = `${this.apiUrl}/manager-overview-deals/${managerId}`;
    console.log(`DealService: Fetching manager overview deals from ${url}`);
    return this.http.get<DealManagerOverview[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

 
 
  getDashboardMetrics(userId: number): Observable<DashboardMetrics> { 
    
   
    const url = `${this.apiUrl}/dashboard-metrics/${userId}`; 
    console.log(`DealService: Fetching dashboard metrics from ${url}`);
    return this.http.get<DashboardMetrics>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getOpenPipelineAmountsByStage(userId: number): Observable<PipelineStageData[]> { 

    const url = `${this.apiUrl}/open-pipeline-stages/${userId}`;
    console.log(`DealService: Fetching open pipeline amounts from ${url}`);
    return this.http.get<PipelineStageData[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getMonthlyRevenueWon(userId: number, months: number = 12): Observable<MonthlyRevenueData[]> { 
   
    const url = `${this.apiUrl}/monthly-revenue-won/${userId}?months=${months}`; 
    console.log(`DealService: Fetching monthly revenue from ${url}`);
    return this.http.get<MonthlyRevenueData[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getTopCustomersByRevenue(userId: number, count: number = 5): Observable<TopCustomerData[]> { 
    
    const url = `${this.apiUrl}/top-customers-by-revenue/${userId}?count=${count}`; 
    console.log(`DealService: Fetching top customers from ${url}`);
    return this.http.get<TopCustomerData[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

 
  getManagerOverviewStageCounts(managerId: number): Observable<ManagerStageCount[]> {
     if (!this.authService.hasPrivilege('overview')) { 
        return throwError(() => new Error('Current user lacks Overview privilege.'));
    }
    const url = `${this.apiUrl}/manager-overview-stage-counts/${managerId}`;
    console.log(`DealService: Fetching manager overview stage counts from ${url}`);
    return this.http.get<ManagerStageCount[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getAllDeals(): Observable<DealRead[]> {
    return this.http.get<DealRead[]>(this.apiUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getDealsForCurrentUser(): Observable<DealRead[]> {
    const currentUserId = this.authService.getUserId(); 

    if (!currentUserId) {
    
      console.error('User ID not found in AuthServiceService.');
      return throwError(() => new Error('User ID is not available. Cannot fetch user-specific deals.'));
    }

   
    const url = `${this.apiUrl}/byCreator/${currentUserId}`;
    
  

    console.log(`Fetching deals for user ID: ${currentUserId} from URL: ${url}`);
    return this.http.get<DealRead[]>(url, this.httpOptions) 
      .pipe(catchError(this.handleError));
  }
  updateDealStage(id: number, stageName: string): Observable<DealRead> { 
    const url = `${this.apiUrl}/${id}/stage`;
    const userId = this.authService.getUserId();

    if (!userId) {
  
      return throwError(() => new Error('User ID not found. Cannot perform action.'));
    }

    
    if (!this.authService.hasPrivilege('StageUpdate')) {
      return throwError(() => new Error('User lacks StageUpdate privilege.'));
    }

    const payload = {
      stageName: stageName,
      performedByUserId: userId 
    };

   
    return this.http.put<DealRead>(url, payload, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

 
  getDealStageHistory(dealId: number): Observable<StageHistoryReadDto[]> {
    const url = `${this.apiUrl}/${dealId}/history`;
   
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
 