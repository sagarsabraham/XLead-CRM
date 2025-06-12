import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { DealManagerOverview, DealService } from 'src/app/services/dealcreation.service';
import { GridColumn } from 'src/app/shared/table/table.interface';
 
@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent {
    tableHeaders: GridColumn[] = [
    { dataField: 'salespersonName', caption: 'Salesperson', cellTemplate: 'ownerCellTemplate' },
    { dataField: 'dealName', caption: 'Deal Name' },
    { dataField: 'stageName', caption: 'Stage' },  
    {
      dataField: 'dealAmount',
      caption: 'Amount',
      dataType: 'number',
      format: { type: 'currency', currency: 'USD' }
    },
    {
      dataField: 'closingDate',
      caption: 'Closing Date',
      dataType: 'date',
      format: 'dd/MMM/yyyy'
    }
  ];
 
 
  tableData: DealManagerOverview[] = [];
 
 
  topcardData: { amount: number; title: string; icon: string; originalTitle?: string }[] = [
    { amount: 0, title: 'Qualification', icon: 'assets/qualification.svg', originalTitle: 'Qualification' },
    { amount: 0, title: 'Need Analysis', icon: 'assets/needanalysis.svg', originalTitle: 'Need Analysis' },
    { amount: 0, title: 'Proposal', icon: 'assets/proposal.svg', originalTitle: 'Proposal/Price Quote' },
    { amount: 0, title: 'Negotiation', icon: 'assets/negotiation.svg', originalTitle: 'Negotiation/Review' },
    { amount: 0, title: 'Closed Won', icon: 'assets/closedwon.svg', originalTitle: 'Closed Won' },
    { amount: 0, title: 'Closed Lost', icon: 'assets/closedlost.svg', originalTitle: 'Closed Lost' }
  ];
 
  isLoading = true;
  errorMessage: string | null = null;
  managerId: number;
 
  constructor(
    private authService: AuthService,
    private dealService: DealService,
    private cdr: ChangeDetectorRef
  ) {
    this.managerId = this.authService.getUserId();
  }
 
  ngOnInit(): void {
    this.loadOverviewData();
  }
 
  loadOverviewData(): void {
    this.isLoading = true;
    this.errorMessage = null;
 
    if (!this.authService.hasPrivilege('Overview')) {
        this.errorMessage = "User does not have 'Overview' privilege.";
        this.isLoading = false;
        console.error(this.errorMessage);
   
        return;
    }
 
   
 
    forkJoin({
      deals: this.dealService.getManagerOverviewDeals(this.managerId),
      stageCounts: this.dealService.getManagerOverviewStageCounts(this.managerId)
    }).subscribe({
      next: (results) => {
       
        this.tableData = results.deals.map(deal => ({
          ...deal,
       
          closingDate: deal.closingDate ? new Date(deal.closingDate).toISOString() : null
        }));
       
        this.topcardData.forEach(card => {
     
          const foundStage = results.stageCounts.find(sc => sc.stageName === (card.originalTitle || card.title));
          card.amount = foundStage ? foundStage.dealCount : 0;
        });
       
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('OverviewPage: Error loading overview data:', err);
        this.errorMessage = err.message || 'Failed to load overview data. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
 
  getIconColor(index: number): string {
    switch (index) {
      case 0: return '#F8A978';
      case 1: return '#92BEFA';
      case 2: return '#B0A3E2';
      case 3: return '#D0D0D0';
      case 4: return '#87DEB2';
      case 5: return '#F48F9F';
      default: return '#000000';
    }
  }
}
 