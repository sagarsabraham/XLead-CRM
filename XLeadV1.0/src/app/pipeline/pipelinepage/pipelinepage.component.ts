import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DealRead, DealService } from 'src/app/services/dealcreation.service';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import { forkJoin } from 'rxjs';
import { DealstageService } from 'src/app/services/dealstage.service';
 
 
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
  customerName: string; 
  account: string;
  contactName: string;
  domain: string;
  revenueType: string;
  country: string;
  description: string;
  doc: string;
  originalData: DealRead;
}
 
export interface PipelineStage {
  name: string;
  amount: number;
  collapsed: boolean;
  hover: boolean;
  deals: PipelineDeal[];
  id?: number;
}
 export interface DealStage {
  id: number;
  displayName?: string;
  stageName?: string;
}
@Component({
  selector: 'app-pipelinepage',
  templateUrl: './pipelinepage.component.html',
  styleUrls: ['./pipelinepage.component.css']
})
export class PipelinepageComponent implements OnInit {
   topcardData = [
    { amount: 0, title: 'Total Return', isCurrency: true, icon: 'assets/dollar-sign-svgrepo-com.svg' },
    { amount: 0, title: 'Total Count of Deals', isCurrency: false, icon: 'assets/count.svg' },
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

  tableHeaders = [
    { dataField: 'title', caption: 'Deal Name', visible: true },
    { dataField: 'amount', caption: 'Amount', visible: true },
    { dataField: 'startDate', caption: 'Start Date', visible: true },
    { dataField: 'closeDate', caption: 'Close Date', visible: true },
    { dataField: 'department', caption: 'Department', visible: true },
    { dataField: 'probability', caption: 'Probability', visible: true },
    { dataField: 'region', caption: 'Region', visible: true },
    { dataField: 'customerName', caption: 'Customer', visible: true },
    { dataField: 'contactName', caption: 'Contact', visible: true },
    { dataField: 'stageName', caption: 'Stage', visible: true }
  ];

  customerContactMap: { [customer: string]: string[] } = {}; 

  selectedTabId: string = 'card';
  selectedTabIndex: number = 0;

  private _tableData: any[] = [];

  switchView(view: 'card' | 'table'): void {
    this.selectedTabId = view;
    this.selectedTabIndex = view === 'card' ? 0 : 1;
 
    if (view === 'table') {
      this.refreshTableData();
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 50);
    }
    this.cdr.detectChanges();
  }
  stageNames: string[] = this.stages.map(s => s.name);
  isLoadingInitialData: boolean = false;
  isModalVisible: boolean = false;
  isEditMode: boolean = false;
  selectedStageId: number | null = null;

  _selectedDealForModalInput: DealRead | null = null;
  _currentlyEditingPipelineDeal: PipelineDeal | null = null;
  _originalStageNameOfEditingDeal: string = '';

  selectedDealIds: string[] = [];

  handleSelectionChanged(event: any): void {
    console.log('Selection changed:', event);
    this.selectedDealIds = event.selectedRowKeys || [];
  }

  constructor(
   private dealService: DealService,
    private companyContactService: CompanyContactService,
    private dealStageService: DealstageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    console.log('PipelinePage: loadInitialData called');
    this.isLoadingInitialData = true;
    this.stages.forEach(stage => stage.deals = []);

    forkJoin({
      deals: this.dealService.getAllDeals(), 
      contactMap: this.companyContactService.getCompanyContactMap(),
      stages: this.dealStageService.getAllDealStages()
    }).subscribe({
      next: (results: {
        deals: DealRead[];
        contactMap: { [company: string]: string[] };
        stages: DealStage[];
      }) => {
        console.log('PipelinePage: Successfully fetched deals, contact map, and stages.');
       
        // Update stage IDs
        this.stages.forEach(stage => {
          const backendStage = results.stages.find(s => s.displayName === stage.name || s.stageName === stage.name);
          if (backendStage) {
            stage.id = backendStage.id;
          }
        });
        console.log('PipelinePage: Successfully fetched deals and contact map.', results);
        this.customerContactMap = results.contactMap; 
        this.processFetchedDeals(results.deals);
        this.updateStageAmountsAndTopCards();
        this.refreshTableData();
        this.isLoadingInitialData = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('PipelinePage: Error fetching initial data (deals, contact map, or stages):', err);
        alert('Failed to load pipeline data. Please try again.');
        this.isLoadingInitialData = false;
        this.cdr.detectChanges();
      }
    });
  }

  private refreshTableData(): void {
    this._tableData = this.stages.flatMap(stage =>
      stage.deals.map(deal => ({
        ...deal,
        stageName: stage.name,
        id: String(deal.id)
      }))
    );
    console.log('Table data refreshed:', this._tableData.length, 'deals');
  }

  findCustomerByContact(contactFullName: string | null | undefined): string | null { // Updated to match backend
    if (!contactFullName || !this.customerContactMap || Object.keys(this.customerContactMap).length === 0) {
      if (!contactFullName) console.warn('findCustomerByContact: called with null/undefined contactFullName.');
      if (!this.customerContactMap || Object.keys(this.customerContactMap).length === 0) console.warn('findCustomerByContact: customerContactMap is empty or null.');
      return null;
    }

    const normalizedSearchContact = contactFullName.trim();

    for (const customerName in this.customerContactMap) {
      if (Object.prototype.hasOwnProperty.call(this.customerContactMap, customerName)) {
        const contactsInCustomer = this.customerContactMap[customerName];
       
        if (Array.isArray(contactsInCustomer)) {
          const found = contactsInCustomer.some(mappedContact => {
            if (typeof mappedContact === 'string') {
              return mappedContact.trim() === normalizedSearchContact;
            }
            return false;
          });

          if (found) {
            return customerName;
          }
        }
      }
    }
    
    return null;
  }

  processFetchedDeals(fetchedDeals: DealRead[]): void {
    console.log('PipelinePage: processFetchedDeals called with', fetchedDeals.length, 'deals.');
    fetchedDeals.forEach(backendDeal => {
      console.log('Processing deal:', backendDeal.dealName, 'Customer:', backendDeal.customerName, 'Contact:', backendDeal.contactName);
      const targetStage = this.stages.find(s => s.name === backendDeal.stageName);
      if (targetStage) {
        let determinedCustomerName = backendDeal.customerName;

        if (!determinedCustomerName && backendDeal.contactName) {
          determinedCustomerName = this.findCustomerByContact(backendDeal.contactName) ?? undefined;
          console.log('Customer name from contact lookup:', determinedCustomerName);
        }

        const finalCustomerName = determinedCustomerName || this.extractCustomerNameFallback(backendDeal) || 'Unknown Customer';
        console.log('Final customer name:', finalCustomerName);

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
          customerName: finalCustomerName,
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
      }
    });
  }

  extractCustomerNameFallback(deal: DealRead): string {
    const match = deal.contactName?.match(/\(([^)]+)\)$/);
    return match ? match[1].trim() : '';
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

  getIconColor(index: number): string {
    switch (index) {
      case 0:
        return '#8a2be2';
      case 1:
        return '#28a745';
      default:
        return '#e0e0e0';
    }
  }

  get connectedDropLists(): string[] {
    return this.stages.map(stage => stage.name);
  }

  toggleCollapse(index: number): void {
    this.stages[index].collapsed = !this.stages[index].collapsed;
  }

  onMouseEnter(index: number): void {
    this.stages[index].hover = true;
  }

  onMouseLeave(index: number): void {
    this.stages[index].hover = false;
  }

  onDealDropped(event: { previousStage: string, currentStage: string, previousIndex: number, currentIndex: number }): void {
    const { previousStage, currentStage, previousIndex, currentIndex } = event;
    const previousStageName = this.stages.find(s => s.name === previousStage);
    const currentStageName = this.stages.find(s => s.name === currentStage);
    const deal = previousStageName?.deals[previousIndex];
    if (previousStageName && currentStageName && deal && deal.id) {
      const dealIndexInPrev = previousStageName.deals.findIndex(d => d.id === deal.id);
      if (dealIndexInPrev > -1) {
        const [movedDeal] = previousStageName.deals.splice(dealIndexInPrev, 1);
        currentStageName.deals.splice(currentIndex, 0, movedDeal);

        console.log(`PipelinePage: Deal "${movedDeal.title}" (ID: ${movedDeal.id}) moved to stage "${currentStage}". Backend update needed.`);
        this.dealService.updateDealStage(deal.id, currentStageName.name).subscribe();

        this.updateStageAmountsAndTopCards();
        this.cdr.detectChanges();
      }
    }
  }

  onAddDeal(stageId?: number): void {
    this.isEditMode = false;
    this._selectedDealForModalInput = null;
    this._currentlyEditingPipelineDeal = null;
    this.selectedStageId = stageId || null; 
    this.isModalVisible = true;
    this.selectedStageId = stageId || null;
  }
onButtonClick(event: { label: string, stageId?: number }) {
    if (event.label === 'Deal') {
      this.onAddDeal(event.stageId);
    }
  }
  onEditDeal(dealFromCard: PipelineDeal, stageName: string): void {
    this.isEditMode = true;
    this._currentlyEditingPipelineDeal = dealFromCard;
    this._originalStageNameOfEditingDeal = stageName;
    this.selectedStageId = null;
    if (dealFromCard.originalData) {
        this._selectedDealForModalInput = { ...dealFromCard.originalData };
    } else {
        console.error("PipelinePage CRITICAL: Original backend data (originalData) is missing from PipelineDeal for editing.", dealFromCard);
        this._selectedDealForModalInput = this.transformPipelineDealToModalInputFallback(dealFromCard);
    }
    this.isModalVisible = true;
  }

  selectedDealForModal(): DealRead | null {
      return this._selectedDealForModalInput;
  }

  transformPipelineDealToModalInputFallback(pipelineDeal: PipelineDeal): DealRead {
      console.warn("PipelinePage: Executing transformPipelineDealToModalInputFallback. Data accuracy for edit might be reduced.");
      const stageId = this.stages.find(s => s.name === pipelineDeal.originalData?.stageName)?.id || pipelineDeal.originalData?.dealStageId;

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
          customerName: pipelineDeal.customerName,
          accountId: pipelineDeal.originalData?.accountId,
          regionId: pipelineDeal.originalData?.regionId,
          domainId: pipelineDeal.originalData?.domainId,
          revenueTypeId: pipelineDeal.originalData?.revenueTypeId,
          duId: pipelineDeal.originalData?.duId,
          countryId: pipelineDeal.originalData?.countryId,
          dealStageId: stageId,
          createdAt: pipelineDeal.originalData?.createdAt || new Date().toISOString(),
          createdBy: pipelineDeal.originalData?.createdBy || 1,
      };
  }

  onModalClose(): void {
    this.isModalVisible = false;
    this.isEditMode = false;
    this._selectedDealForModalInput = null;
    this._currentlyEditingPipelineDeal = null;
    this._originalStageNameOfEditingDeal = '';
    this.selectedStageId = null;
  }

  onDealSubmitSuccess(updatedBackendDeal: DealRead): void {
    console.log('PipelinePage: onDealSubmitSuccess called. Edit Mode:', this.isEditMode, 'Deal:', updatedBackendDeal);

    if (!this.isEditMode) {
      console.log('PipelinePage: New deal submitted. Reloading all initial data to ensure map and deal details are fresh.');
      this.loadInitialData();
      this.onModalClose();
      return;
    }

    console.log('PipelinePage: Processing edited deal in existing view.');
    if (this._currentlyEditingPipelineDeal && this._currentlyEditingPipelineDeal.id === updatedBackendDeal.id) {
      let determinedCustomerName = updatedBackendDeal.customerName;
      if (!determinedCustomerName && updatedBackendDeal.contactName) {
        determinedCustomerName = this.findCustomerByContact(updatedBackendDeal.contactName) ?? undefined;
        console.log('Customer name from contact lookup:', determinedCustomerName);
      }
      const finalCustomerName = determinedCustomerName || this.extractCustomerNameFallback(updatedBackendDeal) || 'Unknown Customer';
      console.log('Final customer name:', finalCustomerName);

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
        customerName: finalCustomerName,
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

      if (originalStage) {
        const indexInOriginal = originalStage.deals.findIndex(d => d.id === updatedPipelineDeal.id);
        if (indexInOriginal > -1) {
          originalStage.deals.splice(indexInOriginal, 1);
        }
      }

      if (newTargetStage) {
        newTargetStage.deals.push(updatedPipelineDeal);
        newTargetStage.deals.sort((a,b) =>
            new Date(a.originalData.closingDate!).getTime() - new Date(b.originalData.closingDate!).getTime()
        );
      }
      alert('Deal updated successfully!');
    } else {
      console.warn('PipelinePage: onDealSubmitSuccess in edit mode, but _currentlyEditingPipelineDeal is mismatched or missing. Reloading data.');
      this.loadInitialData();
    }

    this.updateStageAmountsAndTopCards();
    this.refreshTableData();
    this.onModalClose();
    this.cdr.detectChanges();
  }

  onDealSubmitError(errorMessage: string): void {
    console.error('PipelinePage: Error from deal modal:', errorMessage);
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

  get tableData(): any[] {
    return this._tableData;
  }
}
