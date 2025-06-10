import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseService } from './apiresponse.service';
import { ApiResponse } from '../models/api-response.model';
import { AuthService } from './auth-service.service';

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

export interface DealEditPayload {
  title: string;
  amount: number;
  customerName: string;
  contactFullName: string;
  contactEmail: string | null;
  contactPhoneNumber: string | null;
  contactDesignation: string | null;
  serviceId: number | null;
  accountId: number | null;
  regionId: number;
  domainId: number | null;
  dealStageId: number;
  revenueTypeId: number;
  duId: number;
  countryId: number;
  description: string | null;
  probability: number | null;
  startingDate: string | null;
  closingDate: string | null;
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
  isHidden?: boolean | null;
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
  private apiUrl = `${environment.apiUrl}/api/Deals`;
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiResponseService: ApiResponseService
  ) { }

  createDeal(dealData: DealCreatePayload): Observable<DealRead> {
    const source$ = this.http.post<ApiResponse<DealRead>>(this.apiUrl, JSON.stringify(dealData), this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getDealById(id: number): Observable<DealRead> {
    const url = `${this.apiUrl}/${id}`;
    const source$ = this.http.get<ApiResponse<DealRead>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getManagerOverviewDeals(managerId: number): Observable<DealManagerOverview[]> {
    if (!this.authService.hasPrivilege('Overview')) {
        return throwError(() => new Error('Current user lacks Overview privilege.'));
    }
    const url = `${this.apiUrl}/manager-overview-deals/${managerId}`;
    console.log(`DealService: Fetching manager overview deals from ${url}`);
    const source$ = this.http.get<ApiResponse<DealManagerOverview[]>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getDashboardMetrics(userId: number): Observable<DashboardMetrics> {
    const url = `${this.apiUrl}/dashboard-metrics/${userId}`;
    console.log(`DealService: Fetching dashboard metrics from ${url}`);
    const source$ = this.http.get<ApiResponse<DashboardMetrics>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getOpenPipelineAmountsByStage(userId: number): Observable<PipelineStageData[]> {
    const url = `${this.apiUrl}/open-pipeline-stages/${userId}`;
    console.log(`DealService: Fetching open pipeline amounts from ${url}`);
    const source$ = this.http.get<ApiResponse<PipelineStageData[]>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getMonthlyRevenueWon(userId: number, months: number = 12): Observable<MonthlyRevenueData[]> {
    const url = `${this.apiUrl}/monthly-revenue-won/${userId}?months=${months}`;
    console.log(`DealService: Fetching monthly revenue from ${url}`);
    const source$ = this.http.get<ApiResponse<MonthlyRevenueData[]>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getTopCustomersByRevenue(userId: number, count: number = 5): Observable<TopCustomerData[]> {
    const url = `${this.apiUrl}/top-customers-by-revenue/${userId}?count=${count}`;
    console.log(`DealService: Fetching top customers from ${url}`);
    const source$ = this.http.get<ApiResponse<TopCustomerData[]>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getManagerOverviewStageCounts(managerId: number): Observable<ManagerStageCount[]> {
     if (!this.authService.hasPrivilege('Overview')) {
        return throwError(() => new Error('Current user lacks Overview privilege.'));
    }
    const url = `${this.apiUrl}/manager-overview-stage-counts/${managerId}`;
    console.log(`DealService: Fetching manager overview stage counts from ${url}`);
    const source$ = this.http.get<ApiResponse<ManagerStageCount[]>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getAllDeals(): Observable<DealRead[]> {
    const source$ = this.http.get<ApiResponse<DealRead[]>>(this.apiUrl, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  getDealsForCurrentUser(): Observable<DealRead[]> {
    if (!this.authService.hasPrivilege('PipelineDetailAccess')) {
      return throwError(() => new Error('Permission Denied: User lacks "PipelineDetailAccess" privilege.'));
    }

    const currentUserId = this.authService.getUserId();

    if (!currentUserId) {
      console.error('User ID not found in AuthService.');
      return throwError(() => new Error('User ID is not available. Cannot fetch user-specific deals.'));
    }

    const url = `${this.apiUrl}/byCreator/${currentUserId}`;
    console.log(`Fetching deals for user ID: ${currentUserId} from URL: ${url}`);
    const source$ = this.http.get<ApiResponse<DealRead[]>>(url, this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  updateDeal(id: number, dealData: DealEditPayload): Observable<DealRead> {
    const url = `${this.apiUrl}/${id}`;
    const source$ = this.http.put<ApiResponse<DealRead>>(url, JSON.stringify(dealData), this.httpOptions);
    return this.apiResponseService.handleResponse(source$);
  }

  updateDealStage(id: number, stageName: string): Observable<DealRead> {
    const url = `${this.apiUrl}/${id}/stage`;
    const updateDto = {
      stageName: stageName,
      UpdatedBy: this.authService.getUserId() // Corrected: getUserId()
    };
    const source$ = this.http.put<ApiResponse<DealRead>>(url, updateDto, this.httpOptions);
    return this.apiResponseService.handleResponse(source$).pipe(
        map(response => {
          console.log('Stage update successful, unwrapped response:', response);
          return response; // response is already DealRead here
        })
    );
  }

  getDealStageHistory(id: number): Observable<StageHistoryReadDto[]> {
    const url = `${this.apiUrl}/${id}/stage-history`;
    const userId = this.authService.getUserId(); // Corrected: getUserId()
    if (!userId) {
        return throwError(() => new Error('User ID not found for stage history request.'));
    }
    const params = new HttpParams().set('userId', userId.toString());
    const options = { ...this.httpOptions, params };

    const source$ = this.http.get<ApiResponse<StageHistoryReadDto[]>>(url, options);
    return this.apiResponseService.handleResponse(source$);
  }

  updateDealDescription(id: number, description: string): Observable<DealRead> {
    const url = `${this.apiUrl}/${id}/description`;
    const updateDto = {
      description: description,
      updatedBy: this.authService.getUserId() // Corrected: getUserId()
    };
    const source$ = this.http.put<ApiResponse<DealRead>>(url, updateDto, this.httpOptions);
    return this.apiResponseService.handleResponse(source$).pipe(
        map(response => {
          console.log('Description update successful, unwrapped response:', response);
          return response; // response is already DealRead here
        })
    );
  }
}