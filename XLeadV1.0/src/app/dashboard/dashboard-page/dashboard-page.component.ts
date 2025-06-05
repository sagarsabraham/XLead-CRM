// dashboard-page.component.ts
import { Component, OnInit } from '@angular/core'; // Added OnInit
import { DealService, PipelineStageData } from '../../services/dealcreation.service'; // Adjust path if needed

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit { // Implemented OnInit
  revenueData = [
    { month: 'March 2024', amount: 14567890 },
    { month: 'January 2025', amount: 16885671 },
    { month: 'February 2025', amount: 1897190 },
    { month: 'March 2025', amount: 1897090 },
    { month: 'April 2024', amount: 1234567 },
    { month: 'April 2025', amount: 563457 },
    { month: 'May 2025', amount: 566786 },
    { month: 'June 2025', amount: 56567190 }
  ];

  companyData = [
    { Account: 'Harley Davidson', revenue: 5000 },
    { Account: 'Kim Group', revenue: 4500 },
    { Account: 'Java Co', revenue: 2000 },
    { Account: 'Java Co', revenue: 2000 },
    { Account: 'Java Co', revenue: 2000 },
    { Account: 'Java Co', revenue: 2000 },
  ];

  // --- Updated for dynamic data ---
  // stages: { stage: string, amount: number }[] = [ // Original static data
  //   { stage: 'Qualification', amount: 3343874 },
  //   { stage: 'Needs Analysis', amount: 456711 },
  //   { stage: 'Proposal/Price Quote', amount: 241241 },
  //   { stage: 'Negotiation/Review', amount: 680000 }
  // ];
  stages: { stage: string, amount: number }[] = []; // Initialize as empty for dynamic data
  isLoadingPipelineStages: boolean = true;
  pipelineStagesError: string | null = null;
  // --- End of update ---

  constructor(private dealService: DealService) {} // Injected DealService

  ngOnInit(): void {
    this.loadPipelineStageData();
    // You can also load other dynamic data here, e.g., for companyData and revenueData
    // if they are also to be fetched from an API.
  }

  loadPipelineStageData(): void {
    this.isLoadingPipelineStages = true;
    this.pipelineStagesError = null;
    this.dealService.getOpenPipelineAmountsByStage().subscribe({
      next: (data: PipelineStageData[]) => {
        // The graph component expects { stage: string, amount: number }
        // The API returns { stageName: string, totalAmount: number }
        // So we map it:
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
}