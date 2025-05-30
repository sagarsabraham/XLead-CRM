import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DealRead, DealService } from 'src/app/services/dealcreation.service'; // Adjust path as needed
import { CompanyContactService } from 'src/app/services/company-contact.service'; // Adjust path as needed
import { forkJoin } from 'rxjs';
 
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
 
  isLoadingInitialData: boolean = false;
  isModalVisible: boolean = false;
  isEditMode: boolean = false;
 
  _selectedDealForModalInput: DealRead | null = null;
  _currentlyEditingPipelineDeal: PipelineDeal | null = null;
  _originalStageNameOfEditingDeal: string = '';
 
  companyContactMap: { [company: string]: string[] } = {};
 
  constructor(
    private dealService: DealService,
    private companyContactService: CompanyContactService,
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
      contactMap: this.companyContactService.getCompanyContactMap()
    }).subscribe({
      next: (results) => {
        console.log('PipelinePage: Successfully fetched deals and contact map.');
        // console.log('PipelinePage: Deals from backend:', JSON.parse(JSON.stringify(results.deals)));
        // console.log('PipelinePage: Contact Map from service:', JSON.parse(JSON.stringify(results.contactMap)));
 
        this.companyContactMap = results.contactMap;
        this.processFetchedDeals(results.deals);
        this.updateStageAmountsAndTopCards();
        this.isLoadingInitialData = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('PipelinePage: Error fetching initial data (deals or contact map):', err);
        alert('Failed to load pipeline data. Please try again.');
        this.isLoadingInitialData = false;
        this.cdr.detectChanges();
      }
    });
  }
 
  findCompanyByContact(contactFullName: string | null | undefined): string | null {
    if (!contactFullName || !this.companyContactMap || Object.keys(this.companyContactMap).length === 0) {
      if (!contactFullName) console.warn('findCompanyByContact: called with null/undefined contactFullName.');
      if (!this.companyContactMap || Object.keys(this.companyContactMap).length === 0) console.warn('findCompanyByContact: companyContactMap is empty or null.');
      return null;
    }
 
    const normalizedSearchContact = contactFullName.trim(); // Normalize search term slightly
 
    // DEBUG: Log the map and the contact name you are searching for
    // console.log(`findCompanyByContact: Searching for contact: "${normalizedSearchContact}"`);
    // For very detailed debugging, uncomment the next line, but it can be verbose:
    // console.log('findCompanyByContact: Full Map:', JSON.parse(JSON.stringify(this.companyContactMap)));
 
 
    for (const companyName in this.companyContactMap) {
      if (Object.prototype.hasOwnProperty.call(this.companyContactMap, companyName)) {
        const contactsInCompany = this.companyContactMap[companyName];
        // console.log(`findCompanyByContact: Checking company: "${companyName}", contacts: [${contactsInCompany?.join(', ')}]`);
 
        // Ensure contactsInCompany is an array and normalize contacts within it for comparison
        if (Array.isArray(contactsInCompany)) {
          const found = contactsInCompany.some(mappedContact => {
            if (typeof mappedContact === 'string') {
              return mappedContact.trim() === normalizedSearchContact;
            }
            return false;
          });
 
          if (found) {
            // console.log(`findCompanyByContact: MATCH! Contact "${normalizedSearchContact}" found in company "${companyName}"`);
            return companyName; // Found the company
          }
        } else {
          // console.warn(`findCompanyByContact: contactsInCompany for "${companyName}" is not an array:`, contactsInCompany);
        }
      }
    }
    // console.log(`findCompanyByContact: NO MATCH for contact: "${normalizedSearchContact}"`);
    return null; // Contact not found in any company's list
  }
 
  processFetchedDeals(fetchedDeals: DealRead[]): void {
    console.log('PipelinePage: processFetchedDeals called with', fetchedDeals.length, 'deals.');
    fetchedDeals.forEach(backendDeal => {
      // console.log(`PipelinePage: Processing backendDeal ID: ${backendDeal.id}, Name: ${backendDeal.dealName}, Contact: ${backendDeal.contactName}, Backend Company: ${backendDeal.companyName}`);
 
      const targetStage = this.stages.find(s => s.name === backendDeal.stageName);
      if (targetStage) {
        let determinedCompanyName = backendDeal.companyName;
 
        if (!determinedCompanyName && backendDeal.contactName) {
          // console.log(`PipelinePage: Backend company for deal ${backendDeal.id} is missing. Trying to find by contact: "${backendDeal.contactName}"`);
          determinedCompanyName = this.findCompanyByContact(backendDeal.contactName) ?? undefined;
          // if (determinedCompanyName) {
          //   console.log(`PipelinePage: Found company "${determinedCompanyName}" for contact "${backendDeal.contactName}" for deal ${backendDeal.id}`);
          // } else {
          //   console.log(`PipelinePage: Could NOT find company for contact "${backendDeal.contactName}" for deal ${backendDeal.id}`);
          // }
        }
 
        const finalCompanyName = determinedCompanyName || this.extractCompanyNameFallback(backendDeal) || 'Unknown Co.';
        // if (finalCompanyName === 'Unknown Co.') {
        //    console.warn(`PipelinePage: Deal ID ${backendDeal.id} (${backendDeal.dealName}) ended up with "Unknown Co.". Original backend company: ${backendDeal.companyName}, Contact: ${backendDeal.contactName}, Determined via map: ${determinedCompanyName}`);
        // }
 
 
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
          companyName: finalCompanyName,
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
        console.warn(`PipelinePage: Deal "${backendDeal.dealName}" (ID: ${backendDeal.id}) has an unknown stage: "${backendDeal.stageName}"`);
      }
    });
    // console.log('PipelinePage: processFetchedDeals finished. Current stages:', JSON.parse(JSON.stringify(this.stages)));
  }
 
  extractCompanyNameFallback(deal: DealRead): string {
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
    // This logic was from your original component code.
    // Ensure it matches the purpose of your topcardData.
    // Assuming first card is 'Total Return', second is 'Total Count of Deals'.
    switch (index) {
      case 0: 
        return '#8a2be2'; 
      case 1: // Second card
        return '#28a745'; // Green (example, use your original color)
      default:
        return '#e0e0e0'; // Default gray
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
 
  onDealDropped(event: { previousStageName: string, currentStageName: string, deal: PipelineDeal, previousIndex: number, currentIndex: number }): void {
    const { previousStageName, currentStageName, deal, currentIndex } = event;
    const previousStage = this.stages.find(s => s.name === previousStageName);
    const currentStage = this.stages.find(s => s.name === currentStageName);
 
    if (previousStage && currentStage && deal && deal.id) {
      const dealIndexInPrev = previousStage.deals.findIndex(d => d.id === deal.id);
      if (dealIndexInPrev > -1) {
        const [movedDeal] = previousStage.deals.splice(dealIndexInPrev, 1);
        currentStage.deals.splice(currentIndex, 0, movedDeal);
 
        console.log(`PipelinePage: Deal "${movedDeal.title}" (ID: ${movedDeal.id}) moved to stage "${currentStageName}". Backend update needed.`);
        // TODO: API Call: this.dealService.updateDealStage(movedDeal.id, currentStage.name /* or currentStage.id */).subscribe(...);
 
        this.updateStageAmountsAndTopCards();
        this.cdr.detectChanges();
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
          companyName: pipelineDeal.companyName,
          accountId: pipelineDeal.originalData?.accountId,
          regionId: pipelineDeal.originalData?.regionId,
          domainId: pipelineDeal.originalData?.domainId,
          revenueTypeId: pipelineDeal.originalData?.revenueTypeId,
          duId: pipelineDeal.originalData?.duId,
          countryId: pipelineDeal.originalData?.countryId,
          dealStageId: stageId,
          createdAt: pipelineDeal.originalData?.createdAt || new Date().toISOString(),
          createdBy: pipelineDeal.originalData?.createdBy || 1,
          contactId: pipelineDeal.originalData?.contactId,
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
    console.log('PipelinePage: onDealSubmitSuccess called. Edit Mode:', this.isEditMode, 'Deal:', updatedBackendDeal);
 
    if (!this.isEditMode) {
      // --- THIS IS THE FIX FOR NEWLY CREATED COMPANY/CONTACTS ---
      // If it was a new deal addition (not an edit), reload all initial data.
      // This ensures the companyContactMap is fresh and the new deal is fetched
      // with all its potentially linked data correctly resolved from the backend.
      console.log('PipelinePage: New deal submitted. Reloading all initial data to ensure map and deal details are fresh.');
      this.loadInitialData();
      this.onModalClose(); // Close modal after initiating reload
      // An alert could be here, but loadInitialData will eventually update the UI
      // alert('Deal created successfully! Refreshing pipeline...');
      return; // Exit early as loadInitialData will handle UI updates and map refresh
    }
 
    // --- Logic for UPDATING an EDITED deal in the current view ---
    console.log('PipelinePage: Processing edited deal in existing view.');
    if (this._currentlyEditingPipelineDeal && this._currentlyEditingPipelineDeal.id === updatedBackendDeal.id) {
      let determinedCompanyName = updatedBackendDeal.companyName;
      if (!determinedCompanyName && updatedBackendDeal.contactName) {
        // console.log(`PipelinePage (Edit): Backend company for deal ${updatedBackendDeal.id} is missing. Trying to find by contact: "${updatedBackendDeal.contactName}"`);
        determinedCompanyName = this.findCompanyByContact(updatedBackendDeal.contactName) ?? undefined;
      }
      const finalCompanyName = determinedCompanyName || this.extractCompanyNameFallback(updatedBackendDeal) || 'Unknown Co.';
      // if (finalCompanyName === 'Unknown Co.') {
      //   console.warn(`PipelinePage (Edit): Deal ID ${updatedBackendDeal.id} (${updatedBackendDeal.dealName}) ended up with "Unknown Co." after edit.`);
      // }
 
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
        companyName: finalCompanyName,
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
      } else {
          console.warn(`PipelinePage (Edit): Original stage "${this._originalStageNameOfEditingDeal}" not found for deal ID ${updatedPipelineDeal.id}.`);
      }
 
      if (newTargetStage) {
        newTargetStage.deals.push(updatedPipelineDeal);
        newTargetStage.deals.sort((a,b) =>
            new Date(a.originalData.closingDate!).getTime() - new Date(b.originalData.closingDate!).getTime()
        );
      } else {
        console.warn(`PipelinePage (Edit): New target stage "${updatedBackendDeal.stageName}" not found for edited deal ID ${updatedPipelineDeal.id}. The deal might be misplaced or data will refresh entirely if critical.`);
        // Fallback to full reload if stage integrity is compromised
        this.loadInitialData();
        this.onModalClose();
        return;
      }
      alert('Deal updated successfully!');
    } else {
      console.warn('PipelinePage: onDealSubmitSuccess in edit mode, but _currentlyEditingPipelineDeal is mismatched or missing. Reloading data.');
      this.loadInitialData(); // Fallback if something is inconsistent
    }
 
    this.updateStageAmountsAndTopCards();
    this.onModalClose();
    this.cdr.detectChanges();
  }
 
  onDealSubmitError(errorMessage: string): void {
    console.error('PipelinePage: Error from deal modal:', errorMessage);
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
 