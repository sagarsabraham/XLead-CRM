

import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DealRead, DealService } from 'src/app/services/dealcreation.service';
import { CompanyContactService, CustomerContactMap } from 'src/app/services/company-contact.service'; // Import the new interface
import { forkJoin } from 'rxjs';
import { DealstageService } from 'src/app/services/dealstage.service';
import { Router } from '@angular/router';
import { DxToastComponent } from 'devextreme-angular';
 
 
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
  @ViewChild('toastInstance', { static: false }) toastInstance!: DxToastComponent;
 
   topcardData = [
    { amount: 0, title: 'Total Return', isCurrency: true, icon: 'assets/dollar-sign.svg' },
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
 
  customerContactMap: { [customer: string]: CustomerContactMap } = {};
 
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
  }
  stageNames: string[] = this.stages.map(s => s.name);
  isLoadingInitialData: boolean = false;
  isModalVisible: boolean = false;
  isEditMode: boolean = false;
   selectedStageId: number | null = null;
  isDraggingDeal: boolean = false;
 
  _selectedDealForModalInput: DealRead | null = null;
  _currentlyEditingPipelineDeal: PipelineDeal | null = null;
  _originalStageNameOfEditingDeal: string = '';
 
  selectedDealIds: string[] = [];
 
  handleSelectionChanged(event: any): void {
    console.log('Selection changed:', event);
    this.selectedDealIds = event.selectedRowKeys || [];
  }
 toastMessage: string = '';
  toastType: 'info' | 'success' | 'error' | 'warning' = 'info';
  toastVisible: boolean = false;
  constructor(
   private dealService: DealService,
    private companyContactService: CompanyContactService,
    private dealStageService: DealstageService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {}
  showToast(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cdr.detectChanges();
  }
 
  ngOnInit(): void {
    this.updateCollapsedState();
    this.loadInitialData();
    window.addEventListener('resize', this.handleResize.bind(this));
  }
 
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
 
  private updateCollapsedState(): void {
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
      this.stages.forEach(stage => stage.collapsed = true);
    } else {
      this.stages.forEach(stage => stage.collapsed = false);
    }
    this.cdr.detectChanges();
  }
 
  private handleResize(): void {
    this.updateCollapsedState();
  }
 
 
  loadInitialData(): void {
    console.log('PipelinePage: loadInitialData called');
    this.isLoadingInitialData = true;
    this.stages.forEach(stage => stage.deals = []);
 
    forkJoin({
       deals: this.dealService.getDealsForCurrentUser(),
      contactMap: this.companyContactService.getCompanyContactMap(),
      stages: this.dealStageService.getAllDealStages()
    }).subscribe({
      next: (results: {
        deals: DealRead[];
        contactMap: { [customer: string]: CustomerContactMap };
        stages: DealStage[];
      }) => {
        console.log('PipelinePage: Successfully fetched deals, contact map, and stages.');
         this.customerContactMap = results.contactMap;
        this.processFetchedDeals(results.deals);
        this.updateStageAmountsAndTopCards();
        this.refreshTableData();
        this.isLoadingInitialData = false;
        this.cdr.detectChanges();
        // Update stage IDs
        this.stages.forEach(stage => {
          const backendStage = results.stages.find(s => s.displayName === stage.name || s.stageName === stage.name);
          if (backendStage) {
            stage.id = backendStage.id;
          }
        });
        console.log('PipelinePage: Successfully fetched deals and contact map.', results);
     
      },
      error: (err) => {
        console.error('PipelinePage: Error fetching initial data (deals or contact map):', err);
        this.showToast('Failed to load pipeline data. Please try again', 'error');
 
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
 
  findCustomerByContact(contactFullName: string | null | undefined): string | null {
    if (!contactFullName || !this.customerContactMap || Object.keys(this.customerContactMap).length === 0) {
      return null;
    }
 
    const normalizedSearchContact = contactFullName.trim();
 
    for (const customerName in this.customerContactMap) {
      if (Object.prototype.hasOwnProperty.call(this.customerContactMap, customerName)) {
        // 1. Get the customer info object from the map.
        const customerInfo = this.customerContactMap[customerName];
       
        // 2. Safely access the 'contacts' array within the object.
        if (customerInfo && Array.isArray(customerInfo.contacts)) {
          // 3. Perform the 'some' check on the contacts array.
          const found = customerInfo.contacts.some(mappedContact => {
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
        this.dealService.updateDealStage(deal.id, currentStageName.name).subscribe({
        next: (updatedDeal) => {
            const updatedPipelineDeal: PipelineDeal = {
              id: updatedDeal.id,
              title: updatedDeal.dealName,
              amount: updatedDeal.dealAmount,
              startDate: this.formatDateForDisplay(updatedDeal.startingDate),
              closeDate: this.formatDateForDisplay(updatedDeal.closingDate),
              department: updatedDeal.duName || 'N/A',
              probability: updatedDeal.probability?.toString() + '%' || '0%',
              region: updatedDeal.regionName || 'N/A',
              salesperson: updatedDeal.salespersonName,
              customerName: updatedDeal.customerName || this.findCustomerByContact(updatedDeal.contactName) || this.extractCustomerNameFallback(updatedDeal) || 'Unknown Customer',
              account: updatedDeal.accountName || 'N/A',
              contactName: updatedDeal.contactName || 'N/A',
              domain: updatedDeal.domainName || 'N/A',
              revenueType: updatedDeal.revenueTypeName || 'N/A',
              country: updatedDeal.countryName || 'N/A',
              description: updatedDeal.description || '',
              doc: movedDeal.doc,
              originalData: updatedDeal,
            };
            currentStageName.deals[currentIndex] = updatedPipelineDeal;
            console.log(`Deal "${updatedPipelineDeal.title}" isHidden: ${updatedDeal.isHidden} after moving to stage "${currentStage}".`);
            this.updateStageAmountsAndTopCards();
            this.refreshTableData();
            this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`Failed to update deal stage: ${err.message}`);
            currentStageName.deals.splice(currentIndex, 1);
            previousStageName.deals.splice(previousIndex, 0, movedDeal);
            this.updateStageAmountsAndTopCards();
            this.refreshTableData();
            this.cdr.detectChanges();
            this.showToast(`Error: ${err.message}`, 'error');
           
        }
      });
      }
    }
  }
 
  onAddDeal(stageId?: number): void {
    this.isEditMode = false;
    this._selectedDealForModalInput = null;
    this._currentlyEditingPipelineDeal = null;
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
          isHidden: pipelineDeal.originalData?.isHidden || false,
      };
  }
onTableRowClick(event: any): void {
    if (event && event.data && event.data.id) {
      const dealId = typeof event.data.id === 'string' ? parseInt(event.data.id) : event.data.id;
      const deal = this.stages.flatMap(s => s.deals).find(d => d.id === dealId);
     
      if (deal) {
        this.router.navigate(['/deal-info', dealId], {
          state: {
            deal: deal.originalData,
            fromPipeline: true,
            currentStage: deal.originalData.stageName
          }
        });
      }
    }
  }
 
  onModalClose(): void {
    this.isModalVisible = false;
    this.isEditMode = false;
    this._selectedDealForModalInput = null;
    this._currentlyEditingPipelineDeal = null;
    this._originalStageNameOfEditingDeal = '';
  }
 
  onDealSubmitSuccess(updatedBackendDeal: DealRead): void {
  console.log('PipelinePage: onDealSubmitSuccess called. Edit Mode:', this.isEditMode, 'Deal:', updatedBackendDeal);
  console.log('ServiceId in updatedBackendDeal:', updatedBackendDeal.serviceId);
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
    doc: this._currentlyEditingPipelineDeal?.doc || '',
    originalData: updatedBackendDeal,
  };
 
  if (!this.isEditMode) {
    const targetStage = this.stages.find(s => s.id === this.selectedStageId) || this.stages.find(s => s.name === updatedBackendDeal.stageName);
    if (targetStage) {
      targetStage.deals.push(updatedPipelineDeal);
      targetStage.deals.sort((a, b) =>
        new Date(a.originalData.closingDate!).getTime() - new Date(b.originalData.closingDate!).getTime()
      );
      this.showToast('Deal created successfully!', 'success');
    } else {
      console.warn('Target stage not found for new deal. Reloading data.');
      this.loadInitialData();
    }
  } else {
    if (this._currentlyEditingPipelineDeal && this._currentlyEditingPipelineDeal.id === updatedBackendDeal.id) {
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
        newTargetStage.deals.sort((a, b) =>
          new Date(a.originalData.closingDate!).getTime() - new Date(b.originalData.closingDate!).getTime()
        );
        this.showToast('Deal updated successfully!', 'success');
      } else {
        console.warn('Target stage not found for updated deal. Reloading data.');
        this.loadInitialData();
      }
    } else {
      console.warn('PipelinePage: onDealSubmitSuccess in edit mode, but _currentlyEditingPipelineDeal is mismatched or missing. Reloading data.');
      this.loadInitialData();
    }
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
    refreshDeal(dealId: number): void {
    this.dealService.getDealById(dealId).subscribe({
      next: (updatedDeal) => {
        // Find and update the deal in the appropriate stage
        for (const stage of this.stages) {
          const dealIndex = stage.deals.findIndex(d => d.id === dealId);
          if (dealIndex > -1) {
            // Remove from current stage if stage changed
            if (stage.name !== updatedDeal.stageName) {
              stage.deals.splice(dealIndex, 1);
             
              // Add to new stage
              const newStage = this.stages.find(s => s.name === updatedDeal.stageName);
              if (newStage) {
                const pipelineDeal = this.createPipelineDeal(updatedDeal);
                newStage.deals.push(pipelineDeal);
              }
            } else {
              // Update in place
              stage.deals[dealIndex] = this.createPipelineDeal(updatedDeal);
            }
            break;
          }
        }
       
        this.updateStageAmountsAndTopCards();
        this.refreshTableData();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error refreshing deal:', err);
      }
    });
  }
 
  private createPipelineDeal(backendDeal: DealRead): PipelineDeal {
    let determinedCustomerName = backendDeal.customerName;
 
    if (!determinedCustomerName && backendDeal.contactName) {
      determinedCustomerName = this.findCustomerByContact(backendDeal.contactName) ?? undefined;
    }
 
    const finalCustomerName = determinedCustomerName || this.extractCustomerNameFallback(backendDeal) || 'Unknown Customer';
 
    return {
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
  }
 
 
onCardClick(deal: PipelineDeal, stageName: string): void {
  console.log('Card clicked - Deal:', deal.title, 'Stage:', stageName);
  console.log('Original data stage:', deal.originalData?.stageName);
 
  this.router.navigate(['/deal-info', deal.id], {
    state: {
      deal: {
        ...deal.originalData,
        stageName: deal.originalData?.stageName || stageName, // Ensure stage is included
        currentStage: deal.originalData?.stageName || stageName,
        closingDate: deal.originalData?.closingDate || deal.closeDate
      },
      fromPipeline: true
    }
  });
}
 
}
 
 