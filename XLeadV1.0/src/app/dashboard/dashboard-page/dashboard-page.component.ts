import { Component, OnInit } from '@angular/core'; // Added OnInit
import { DealService, MonthlyRevenueData, PipelineStageData, TopCustomerData } from '../../services/dealcreation.service'; // Adjust path if needed
import { AuthService } from 'src/app/services/auth-service.service';
 
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit { // Implemented OnInit
  revenueData: { month: string, amount: number }[] = []; // Initialize as empty
  isLoadingRevenueData: boolean = true;
  revenueDataError: string | null = null;
 
  currentUserId: number;
   companyData: { Account: string, revenue: number }[] = []; // Initialize as empty
  isLoadingTopCompanies: boolean = true;
  topCompaniesError: string | null = null;
 
  stages: { stage: string, amount: number }[] = []; // Initialize as empty for dynamic data
  isLoadingPipelineStages: boolean = true;
  pipelineStagesError: string | null = null;
  // --- End of update ---
 
  constructor(private dealService: DealService, private authService: AuthService) {
        this.currentUserId = this.authService.getUserId(); 
  } // Injected DealService
 
  ngOnInit(): void {
     if (!this.currentUserId) {
        // Handle case where userId might not be available, though with hardcoding it should be
        console.error("Dashboard Page: User ID not available on init.");
        this.revenueDataError = this.topCompaniesError = this.pipelineStagesError = "User context not found.";
        this.isLoadingRevenueData = this.isLoadingTopCompanies = this.isLoadingPipelineStages = false;
        return;
    }
    this.loadPipelineStageData();
     this.loadMonthlyRevenueData();
       this.loadTopCompanyData();
 
  }
 
   loadTopCompanyData(count: number = 5): void {
    this.isLoadingTopCompanies = true;
    this.topCompaniesError = null;
    this.dealService.getTopCustomersByRevenue(this.currentUserId, count).subscribe({
      next: (data: TopCustomerData[]) => {
       
        this.companyData = data.map(item => ({
          Account: item.customerName,
          revenue: item.totalRevenueWon
        }));
        this.isLoadingTopCompanies = false;
      },
      error: (err) => {
        console.error('Error fetching top company data:', err);
        this.topCompaniesError = err.message || 'Failed to load top company data.';
        this.isLoadingTopCompanies = false;
        this.companyData = []; // Clear data or set to default on error
      }
    });
  }
 
  loadPipelineStageData(): void {
    this.isLoadingPipelineStages = true;
    this.pipelineStagesError = null;
    this.dealService.getOpenPipelineAmountsByStage(this.currentUserId).subscribe({
      next: (data: PipelineStageData[]) => {
       
        this.stages = data.map(item => ({
          stage: item.stageName,
          amount: item.totalAmount
        }));
        this.isLoadingPipelineStages = false;
      },
      error: (err) => {
        console.error('Error fetching pipeline stage data for graph:', err);
        this.pipelineStagesError = err.message || 'Failed to load pipeline stage data.';
        this.isLoadingPipelineStages = false;
        this.stages = []; // Optionally, set to empty or default data on error
      }
    });
  }
 
    // --- START: New method to load revenue data ---
  loadMonthlyRevenueData(numberOfMonths: number = 12): void {
    this.isLoadingRevenueData = true;
    this.revenueDataError = null;
    this.dealService.getMonthlyRevenueWon(this.currentUserId, numberOfMonths).subscribe({
      next: (data: MonthlyRevenueData[]) => {
       
        this.revenueData = data.map(item => ({
          month: item.monthYear,
          amount: item.totalRevenue
        }));
        this.isLoadingRevenueData = false;
      },
      error: (err) => {
        console.error('Error fetching monthly revenue data:', err);
        this.revenueDataError = err.message || 'Failed to load monthly revenue data.';
        this.isLoadingRevenueData = false;
        this.revenueData = []; // Clear data or set to default on error
      }
    });
 
   
  }
}