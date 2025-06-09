import { Component, OnInit } from '@angular/core'; // Added OnInit
import { AuthService } from 'src/app/services/auth-service.service';
// DxResponsiveBoxModule is likely not needed here unless you explicitly use dx-responsive-box in this component's HTML
// import { DxResponsiveBoxModule } from 'devextreme-angular';
import { DealService,DashboardMetricItem,DashboardMetrics } from 'src/app/services/dealcreation.service';// Adjust path if needed
 
interface MetricCardData {
  title: string;
  value: string;
  percentage: number;
  isPositive: boolean;
}
 
@Component({
  selector: 'app-metric-card-outline',
  templateUrl: './metric-card-outline.component.html',
  styleUrls: ['./metric-card-outline.component.css'],
})
export class MetricCardOutlineComponent implements OnInit { // Implemented OnInit
  cards: MetricCardData[] = []; // Initialize as empty
  isLoading: boolean = true;
  errorMessage: string | null = null;
  currentUserId: number; 
  // Original hardcoded titles, can be used if API doesn't provide them directly
  private cardTitles = {
    openPipelines: 'Open Pipelines - This Month',
    pipelinesWon: 'Pipeline Won - This Month',
    pipelinesLost: 'Pipeline Lost - This Month',
    revenueWon: 'Revenue Won - This Month'
  };
 
  constructor(private dealService: DealService, private authService: AuthService ) {
    this.currentUserId = this.authService.getUserId();
  } // Injected DealService
 
  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = null;
       if (!this.currentUserId) {
        this.errorMessage = 'User ID not available for dashboard metrics.';
        this.isLoading = false;
        console.error(this.errorMessage);
        this.setDefaultCardsOnError();
        return;
    }
    this.dealService.getDashboardMetrics(this.currentUserId).subscribe({
      next: (metrics: DashboardMetrics) => {
        this.cards = [
          {
            title: this.cardTitles.openPipelines,
            value: metrics.openPipelines.value,
            percentage: metrics.openPipelines.percentageChange,
            isPositive: metrics.openPipelines.isPositiveTrend
          },
          {
            title: this.cardTitles.pipelinesWon,
            value: metrics.pipelinesWon.value,
            percentage: metrics.pipelinesWon.percentageChange,
            isPositive: metrics.pipelinesWon.isPositiveTrend
          },
          {
            title: this.cardTitles.pipelinesLost,
            value: metrics.pipelinesLost.value,
            percentage: metrics.pipelinesLost.percentageChange,
            isPositive: metrics.pipelinesLost.isPositiveTrend
          },
          {
            title: this.cardTitles.revenueWon,
            value: metrics.revenueWon.value,
            percentage: metrics.revenueWon.percentageChange,
            isPositive: metrics.revenueWon.isPositiveTrend
          }
        ];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard metrics:', err);
        this.errorMessage = err.message || 'Failed to load dashboard metrics.';
        this.isLoading = false;
        // Optionally, initialize with default/empty cards
        this.cards = [ // Default empty state on error
            { title: this.cardTitles.openPipelines, value: 'N/A', percentage: 0, isPositive: true },
            { title: this.cardTitles.pipelinesWon, value: 'N/A', percentage: 0, isPositive: true },
            { title: this.cardTitles.pipelinesLost, value: 'N/A', percentage: 0, isPositive: true },
            { title: this.cardTitles.revenueWon, value: 'N/A', percentage: 0, isPositive: true }
        ];
      }
    });

  }
        private setDefaultCardsOnError(): void {
    this.cards = [ 
        { title: this.cardTitles.openPipelines, value: 'N/A', percentage: 0, isPositive: true },
        { title: this.cardTitles.pipelinesWon, value: 'N/A', percentage: 0, isPositive: true },
        { title: this.cardTitles.pipelinesLost, value: 'N/A', percentage: 0, isPositive: true },
        { title: this.cardTitles.revenueWon, value: 'N/A', percentage: 0, isPositive: true }
    ];
  }
}