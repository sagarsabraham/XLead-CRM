import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DealRead, DealService } from 'src/app/services/dealcreation.service';
 // Adjust path as needed

// Interface for deals within this component's local 'stages' structure
export interface PipelineDeal {
  id: number; 
  title: string;
  amount: number;
  startDate: string; 
  closeDate: string; 
  department: string; 
  probability: string; 
  region: string; 
  salesperson?: string | null;
  companyName: string; 
  account: string; 
  contactName: string;
  domain: string; 
  revenueType: string; 
  country: string; 
  description: string;
  doc: string; 
  originalData: DealRead; // Stores the raw DealRead object for this PipelineDeal
}

export interface PipelineStage {
  name: string;
  amount: number;
  collapsed: boolean;
  hover: boolean;
  deals: PipelineDeal[];
  id?: number; 
}

@Component({
  selector: 'app-pipelinepage',
  templateUrl: './pipelinepage.component.html',
  styleUrls: ['./pipelinepage.component.css']
})
export class PipelinepageComponent implements OnInit {
  topcardData = [
    { amount: 0, title: 'Total Return', isCurrency: true, icon: 'money', iconBackgroundColor: '#ECB985', variant: 'default' },
    { amount: 0, title: 'Total Count of Deals', isCurrency: false, icon: 'sorted', iconBackgroundColor: '#ECB985', variant: 'default' }
  ];
  dealButton = [{ label: 'Deal', icon: 'add' }];

  stages: PipelineStage[] = [
    { name: 'Qualification', amount: 0, collapsed: false, hover: false, deals: [] },
    { name: 'Need Analysis', amount: 0, collapsed: false, hover: false, deals: [] },
    { name: 'Proposal/Price Quote', amount: 0, collapsed: false, hover: false, deals: [] },
    { name: 'Negotiation/Review', amount: 0, collapsed: false, hover: false, deals: [] },
    { name: 'Closed Won', amount: 0, collapsed: false, hover: false, deals: [] },
    { name: 'Closed Lost', amount: 0, collapsed: false, hover: false, deals: [] }
  ];
  stageNames: string[] = this.stages.map(s => s.name);

  isLoadingDeals: boolean = false;
  isModalVisible: boolean = false;
  isEditMode: boolean = false;
  
  _selectedDealForModalInput: DealRead | null = null; 
  _currentlyEditingPipelineDeal: PipelineDeal | null = null; 
  _originalStageNameOfEditingDeal: string = '';

  constructor(
    private dealService: DealService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadDeals();
  }

  loadDeals(): void {
    this.isLoadingDeals = true;
    this.stages.forEach(stage => stage.deals = []); 

    this.dealService.getAllDeals().subscribe({
      next: (fetchedDeals: DealRead[]) => {
        this.processFetchedDeals(fetchedDeals);
        this.updateStageAmountsAndTopCards();
        this.isLoadingDeals = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching deals:', err);
        alert('Failed to load deals. Please try again.');
        this.isLoadingDeals = false;
      }
    });
  }

  processFetchedDeals(fetchedDeals: DealRead[]): void {
    fetchedDeals.forEach(backendDeal => {
      const targetStage = this.stages.find(s => s.name === backendDeal.stageName);
      if (targetStage) {
        const pipelineDeal: PipelineDeal = {
          id: backendDeal.id,
          title: backendDeal.dealName,
          amount: backendDeal.dealAmount,
          startDate: this.formatDateForDisplay(backendDeal.startingDate),
          closeDate: this.formatDateForDisplay(backendDeal.closingDate),
          department: backendDeal.duName || 'N/A',
          probability: backendDeal.probability?.toString() + '%' || '0%',
          region: backendDeal.regionName || 'N/A',
          salesperson: backendDeal.salespersonName,
          companyName: backendDeal.companyName || this.extractCompanyNameFallback(backendDeal),
          account: backendDeal.accountName || 'N/A',
          contactName: backendDeal.contactName || 'N/A',
          domain: backendDeal.domainName || 'N/A',
          revenueType: backendDeal.revenueTypeName || 'N/A',
          country: backendDeal.countryName || 'N/A',
          description: backendDeal.description || '',
          doc: '', 
          originalData: backendDeal,
        };
        targetStage.deals.push(pipelineDeal);
      } else {
        console.warn(`Deal "${backendDeal.dealName}" (ID: ${backendDeal.id}) has an unknown stage: "${backendDeal.stageName}"`);
      }
    });
  }

  extractCompanyNameFallback(deal: DealRead): string {
    const match = deal.contactName?.match(/\(([^)]+)\)$/);
    return match ? match[1] : 'Unknown Co.';
  }

  formatDateForDisplay(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return 'N/A';
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return typeof dateInput === 'string' ? dateInput : 'Invalid Date';
    }
  }

  // --- RESTORED METHOD IMPLEMENTATIONS ---
  getIconColor(index: number): string {
    // This logic was from your original component code.
    // Ensure it matches the purpose of your topcardData.
    // Assuming first card is 'Total Return', second is 'Total Count of Deals'.
    switch (index) {
      case 0: // First card
        return '#8a2be2'; // Violet (example, use your original color)
      case 1: // Second card
        return '#28a745'; // Green (example, use your original color)
      default:
        return '#e0e0e0'; // Default gray
    }
  }

  get connectedDropLists(): string[] {
    return this.stages.map(stage => stage.name);
  }
  // --- END OF RESTORED METHODS ---

  toggleCollapse(index: number): void { 
    this.stages[index].collapsed = !this.stages[index].collapsed;
  }
  onMouseEnter(index: number): void { 
    this.stages[index].hover = true; 
  }
  onMouseLeave(index: number): void { 
    this.stages[index].hover = false; 
  }
  
  onDealDropped(event: { previousStageName: string, currentStageName: string, deal: PipelineDeal, previousIndex: number, currentIndex: number }): void { 
    const { previousStageName, currentStageName, deal, currentIndex } = event;
    const previousStage = this.stages.find(s => s.name === previousStageName);
    const currentStage = this.stages.find(s => s.name === currentStageName);

    if (previousStage && currentStage && deal && deal.id) {
      const dealIndexInPrev = previousStage.deals.findIndex(d => d.id === deal.id);
      if (dealIndexInPrev > -1) {
        const [movedDeal] = previousStage.deals.splice(dealIndexInPrev, 1);
        currentStage.deals.splice(currentIndex, 0, movedDeal);
        
        console.log(`Deal "${movedDeal.title}" (ID: ${movedDeal.id}) moved to stage "${currentStageName}". Backend update needed.`);
        // TODO: API Call: this.dealService.updateDealStage(movedDeal.id, currentStage.name /* or currentStage.id */).subscribe(...);
        
        this.updateStageAmountsAndTopCards();
      }
    }
  }

  onAddDeal(): void {
    this.isEditMode = false;
    this._selectedDealForModalInput = null;
    this._currentlyEditingPipelineDeal = null;
    this.isModalVisible = true;
  }

  onEditDeal(dealFromCard: PipelineDeal, stageName: string): void {
    this.isEditMode = true;
    this._currentlyEditingPipelineDeal = dealFromCard; 
    this._originalStageNameOfEditingDeal = stageName;

    if (dealFromCard.originalData) {
        this._selectedDealForModalInput = { ...dealFromCard.originalData };
    } else {
        console.error("CRITICAL: Original backend data (originalData) is missing from PipelineDeal for editing.", dealFromCard);
        this._selectedDealForModalInput = this.transformPipelineDealToModalInputFallback(dealFromCard);
    }
    this.isModalVisible = true;
  }
  
  selectedDealForModal(): DealRead | null {
      return this._selectedDealForModalInput;
  }

  transformPipelineDealToModalInputFallback(pipelineDeal: PipelineDeal): DealRead {
      console.warn("Executing transformPipelineDealToModalInputFallback. Data accuracy for edit might be reduced.");
      return {
          id: pipelineDeal.id,
          dealName: pipelineDeal.title,
          dealAmount: pipelineDeal.amount,
          salespersonName: pipelineDeal.salesperson,
          startingDate: pipelineDeal.originalData?.startingDate || new Date(pipelineDeal.startDate).toISOString(),
          closingDate: pipelineDeal.originalData?.closingDate || new Date(pipelineDeal.closeDate).toISOString(),
          description: pipelineDeal.description,
          probability: parseFloat(pipelineDeal.probability.replace('%','')),
          stageName: pipelineDeal.originalData?.stageName, 
          duName: pipelineDeal.department,
          regionName: pipelineDeal.region,
          accountName: pipelineDeal.account,
          contactName: pipelineDeal.contactName,
          domainName: pipelineDeal.domain,
          revenueTypeName: pipelineDeal.revenueType,
          countryName: pipelineDeal.country,
          companyName: pipelineDeal.companyName, 
          accountId: pipelineDeal.originalData?.accountId,
          regionId: pipelineDeal.originalData?.regionId,
          domainId: pipelineDeal.originalData?.domainId,
          revenueTypeId: pipelineDeal.originalData?.revenueTypeId,
          duId: pipelineDeal.originalData?.duId,
          countryId: pipelineDeal.originalData?.countryId,
          dealStageId: pipelineDeal.originalData?.dealStageId,
          createdAt: pipelineDeal.originalData?.createdAt || new Date().toISOString(),
          createdBy: pipelineDeal.originalData?.createdBy || 1, 
          contactId: pipelineDeal.originalData?.contactId || 0, 
      };
  }

  onModalClose(): void { 
    this.isModalVisible = false;
    this.isEditMode = false;
    this._selectedDealForModalInput = null;
    this._currentlyEditingPipelineDeal = null;
    this._originalStageNameOfEditingDeal = '';
  }

  onDealSubmitSuccess(updatedBackendDeal: DealRead): void { 
    if (this.isEditMode && this._currentlyEditingPipelineDeal && this._currentlyEditingPipelineDeal.id === updatedBackendDeal.id) {
      const updatedPipelineDeal: PipelineDeal = {
        id: updatedBackendDeal.id,
        title: updatedBackendDeal.dealName,
        amount: updatedBackendDeal.dealAmount,
        startDate: this.formatDateForDisplay(updatedBackendDeal.startingDate),
        closeDate: this.formatDateForDisplay(updatedBackendDeal.closingDate),
        department: updatedBackendDeal.duName || 'N/A',
        probability: updatedBackendDeal.probability?.toString() + '%' || '0%',
        region: updatedBackendDeal.regionName || 'N/A',
        salesperson: updatedBackendDeal.salespersonName,
        companyName: updatedBackendDeal.companyName || this.extractCompanyNameFallback(updatedBackendDeal),
        account: updatedBackendDeal.accountName || 'N/A',
        contactName: updatedBackendDeal.contactName || 'N/A',
        domain: updatedBackendDeal.domainName || 'N/A',
        revenueType: updatedBackendDeal.revenueTypeName || 'N/A',
        country: updatedBackendDeal.countryName || 'N/A',
        description: updatedBackendDeal.description || '',
        doc: this._currentlyEditingPipelineDeal.doc, 
        originalData: updatedBackendDeal,
      };

      const originalStage = this.stages.find(s => s.name === this._originalStageNameOfEditingDeal);
      const newTargetStage = this.stages.find(s => s.name === updatedBackendDeal.stageName);

      if (originalStage && newTargetStage) {
        const indexInOriginal = originalStage.deals.findIndex(d => d.id === updatedPipelineDeal.id);
        if (indexInOriginal > -1) {
          originalStage.deals.splice(indexInOriginal, 1);
        }
        newTargetStage.deals.push(updatedPipelineDeal); 
        newTargetStage.deals.sort((a,b) => 
            new Date(a.originalData.closingDate!).getTime() - new Date(b.originalData.closingDate!).getTime()
        );
      } else {
        this.loadDeals(); 
      }
    } else { 
      const newPipelineDeal: PipelineDeal = {
        id: updatedBackendDeal.id,
        title: updatedBackendDeal.dealName,
        amount: updatedBackendDeal.dealAmount,
        startDate: this.formatDateForDisplay(updatedBackendDeal.startingDate),
        closeDate: this.formatDateForDisplay(updatedBackendDeal.closingDate),
        department: updatedBackendDeal.duName || 'N/A',
        probability: updatedBackendDeal.probability?.toString() + '%' || '0%',
        region: updatedBackendDeal.regionName || 'N/A',
        salesperson: updatedBackendDeal.salespersonName,
        companyName: updatedBackendDeal.companyName || this.extractCompanyNameFallback(updatedBackendDeal),
        account: updatedBackendDeal.accountName || 'N/A',
        contactName: updatedBackendDeal.contactName || 'N/A',
        domain: updatedBackendDeal.domainName || 'N/A',
        revenueType: updatedBackendDeal.revenueTypeName || 'N/A',
        country: updatedBackendDeal.countryName || 'N/A',
        description: updatedBackendDeal.description || '',
        doc: '', 
        originalData: updatedBackendDeal,
      };
      const targetStage = this.stages.find(s => s.name === newPipelineDeal.originalData.stageName);
      if (targetStage) {
        targetStage.deals.push(newPipelineDeal);
        targetStage.deals.sort((a,b) => 
            new Date(a.originalData.closingDate!).getTime() - new Date(b.originalData.closingDate!).getTime()
        );
      } else {
        this.loadDeals(); 
      }
    }

    this.updateStageAmountsAndTopCards();
    this.onModalClose();
    this.cdr.detectChanges();
  }

  onDealSubmitError(errorMessage: string): void { 
    console.error('Error from deal modal:', errorMessage);
    alert(`Deal operation failed: ${errorMessage}`);
  }

  updateStageAmountsAndTopCards(): void { 
    let grandTotalReturn = 0;
    let grandTotalDeals = 0;

    this.stages.forEach(stage => {
      stage.amount = stage.deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
      grandTotalReturn += stage.amount;
      grandTotalDeals += stage.deals.length;
    });

    const totalReturnCard = this.topcardData.find(card => card.title === 'Total Return');
    if (totalReturnCard) totalReturnCard.amount = grandTotalReturn;

    const totalCountCard = this.topcardData.find(card => card.title === 'Total Count of Deals');
    if (totalCountCard) totalCountCard.amount = grandTotalDeals;
  }
}