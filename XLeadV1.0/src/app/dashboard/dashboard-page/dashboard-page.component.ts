// dashboard-page.component.ts
import { Component, OnInit } from '@angular/core'; // Added OnInit
import { DealService, MonthlyRevenueData, PipelineStageData, TopCustomerData } from '../../services/dealcreation.service'; // Adjust path if needed

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit { // Implemented OnInit
  revenueData: { month: string, amount: number }[] = []; // Initialize as empty
  isLoadingRevenueData: boolean = true;
  revenueDataError: string | null = null;


   companyData: { Account: string, revenue: number }[] = []; // Initialize as empty
  isLoadingTopCompanies: boolean = true;
  topCompaniesError: string | null = null;
  
  stages: { stage: string, amount: number }[] = []; // Initialize as empty for dynamic data
  isLoadingPipelineStages: boolean = true;
  pipelineStagesError: string | null = null;
  // --- End of update ---

  constructor(private dealService: DealService) {} // Injected DealService

  ngOnInit(): void {
    this.loadPipelineStageData();
     this.loadMonthlyRevenueData();
       this.loadTopCompanyData();
  
  }

   loadTopCompanyData(count: number = 5): void {
    this.isLoadingTopCompanies = true;
    this.topCompaniesError = null;
    this.dealService.getTopCustomersByRevenue(count).subscribe({
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
    this.dealService.getOpenPipelineAmountsByStage().subscribe({
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
    this.dealService.getMonthlyRevenueWon(numberOfMonths).subscribe({
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