import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DealService } from 'src/app/services/dealcreation.service';
import { DealstageService } from 'src/app/services/dealstage.service';

@Component({
  selector: 'app-dealinfopage',
  templateUrl: './dealinfopage.component.html',
  styleUrls: ['./dealinfopage.component.css']
})
export class DealinfopageComponent implements OnInit {
  deal: any = null;
  dealId: number | null = null;
  history: any[] = [];
  isMobile: boolean = false;
  desktopSelectedTabId: string = 'history'; 
  mobileSelectedTabId: string = 'deal-stage';
  stages: any[] = [];
  isLoading: boolean = true;
  isUpdatingStage: boolean = false;
  
  // Store original customer data to prevent loss
  private originalCustomerData: any = {};

  mobileTabs = [
    { text: 'Deal Stage', id: 'deal-stage' },
    { text: 'Deal Info', id: 'deal-info' },
    { text: 'History', id: 'history' },
    { text: 'Documents', id: 'documents' },
    { text: 'Notes', id: 'notes' }
  ];
 
  desktopTabs = [
    { text: 'History', id: 'history' },
    { text: 'Documents', id: 'documents' },
    { text: 'Notes', id: 'notes' }
  ];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private dealService: DealService,
    private dealStageService: DealstageService
  ) {}
 
  ngOnInit() { 
    console.log('=== DEAL INFO PAGE INIT ===');
    this.checkScreenSize();
    this.loadStages();
    
    // First check if deal data was passed via navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || window.history.state;
    
    console.log('Navigation state:', state);
    
    if (state && state.deal) {
      console.log('Deal found in state:', state.deal);
      console.log('Stage from state:', state.deal.stageName);
      this.dealId = state.deal.id;
      this.processDealData(state.deal);
      this.loadStageHistory();
    } else {
      // If no deal in state, check route params
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.dealId = +params['id'];
          console.log('Loading deal by ID:', this.dealId);
          this.loadDealData();
        } else {
          console.error('No deal data found in navigation state or params');
        }
      });
    }
  }

  loadStages() {
    this.dealStageService.getAllDealStages().subscribe({
      next: (stages) => {
        this.stages = stages;
      },
      error: (err) => {
        console.error('Error loading stages:', err);
      }
    });
  }

  loadDealData() {
    if (!this.dealId) return;
    
    this.isLoading = true;
    this.dealService.getDealById(this.dealId).subscribe({
      next: (dealData) => {
        this.processDealData(dealData);
        this.loadStageHistory();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading deal:', err);
        alert('Failed to load deal data');
        this.isLoading = false;
      }
    });
  }

  loadStageHistory() {
    if (!this.dealId) return;

    this.dealService.getDealStageHistory(this.dealId).subscribe({
      next: (history) => {
        this.processStageHistory(history);
      },
      error: (err) => {
        console.error('Error loading stage history:', err);
        // Create default history entry if endpoint doesn't exist or returns error
        this.history = [{
          timestamp: this.formatDate(this.deal?.startDate ? new Date(this.deal.startDate) : new Date()),
          editedBy: 'System',
          fromStage: 'Initial',
          toStage: this.deal?.stage || 'Qualification'
        }];
      }
    });
  }

  processDealData(dealData: any) {
    console.log('Processing deal data:', dealData); // Debug log
    
    // Store original customer data before processing
    this.originalCustomerData = {
      customerName: dealData.customerName || dealData.companyName,
      contactName: dealData.contactName,
      contactEmail: dealData.contactEmail,
      contactPhone: dealData.contactPhone,
      companyWebsite: dealData.companyWebsite,
      companyPhone: dealData.companyPhone
    };

    // Get the stage - check multiple possible field names
    let stageName = dealData.stageName || 
                    dealData.stage || 
                    dealData.dealStage || 
                    dealData.currentStage ||
                    dealData.stageDisplayName;
    
    // If stage is still not found, check if it's nested in another object
    if (!stageName && dealData.dealStage) {
      stageName = dealData.dealStage.stageName || dealData.dealStage.displayName;
    }
    
    console.log('Stage name found:', stageName); // Debug log

    this.deal = {
      id: dealData.id || dealData.dealId,
      title: dealData.dealName || dealData.title,
      startDate: dealData.startingDate || dealData.startDate,
      closingDate: dealData.closingDate || dealData.expectedClosingDate || dealData.date,
      amount: dealData.dealAmount || dealData.amount,
      companyName: dealData.customerName || dealData.companyName || this.originalCustomerData.customerName,
      contactName: dealData.contactName || this.originalCustomerData.contactName,
      contactEmail: dealData.contactEmail || this.originalCustomerData.contactEmail || 
                   `${(dealData.contactName || '').replace(/\s+/g, '.').toLowerCase()}@example.com`,
      contactPhone: dealData.contactPhone || this.originalCustomerData.contactPhone || '+919847908657',
      salesperson: dealData.salespersonName || dealData.salesperson,
      stage: stageName || 'Qualification',
      description: dealData.description || '',
      companyWebsite: dealData.companyWebsite || this.originalCustomerData.companyWebsite ||
                      `info@${(dealData.customerName || dealData.companyName || '').toLowerCase().replace(/\s+/g, '')}.com`,
      companyPhone: dealData.companyPhone || this.originalCustomerData.companyPhone || '+917745635467',
      probability: dealData.probability,
      region: dealData.regionName || dealData.region,
      domain: dealData.domainName || dealData.domain,
      revenueType: dealData.revenueTypeName || dealData.revenueType,
      du: dealData.duName || dealData.du,
      country: dealData.countryName || dealData.country,
      createdAt: dealData.createdAt || dealData.startingDate || new Date()
    };
    
    console.log('Processed deal with stage:', this.deal.stage); // Debug log
    
    this.dealId = dealData.id || dealData.dealId;
  }

  // Helper method to format dates consistently
  private formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      console.warn('Invalid date detected, using current date');
      date = new Date();
    }
    // Format as YYYY-MM-DD HH:MM:SS to ensure consistency
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  processStageHistory(history: any[]) {
    this.history = [];
    
    if (!history || history.length === 0) {
      // Add initial creation entry
      this.history.push({
        timestamp: this.formatDate(this.deal?.startDate ? new Date(this.deal.startDate) : new Date()),
        editedBy: 'System',
        fromStage: 'Initial',
        toStage: this.deal.stage || 'Qualification'
      });
      return;
    }
    
    // Sort history by date (oldest first)
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.timestamp);
      const dateB = new Date(b.createdAt || b.timestamp);
      return dateA.getTime() - dateB.getTime();
    });
    
    let previousStage = 'Initial';
    
    sortedHistory.forEach((entry) => {
      const date = new Date(entry.createdAt || entry.timestamp);
      const toStage = entry.stageDisplayName || entry.stageName || entry.toStage;
      this.history.push({
        timestamp: this.formatDate(date),
        editedBy: entry.createdBy || entry.editedBy || 'Unknown User',
        fromStage: entry.fromStage || previousStage,
        toStage: toStage
      });
      previousStage = toStage;
    });
    
    // Reverse to show newest first
    this.history.reverse();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }
 
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile && (this.mobileSelectedTabId === '' || this.mobileSelectedTabId === 'history' || this.mobileSelectedTabId === 'documents' || this.mobileSelectedTabId === 'notes')) {
      this.mobileSelectedTabId = 'deal-stage';
    }
    if (!this.isMobile && (this.desktopSelectedTabId === '' || this.desktopSelectedTabId === 'deal-stage' || this.desktopSelectedTabId === 'deal-info')) {
      this.desktopSelectedTabId = 'history';
    }
  }
 
  onStageChange(newStage: string) {
    if (!this.dealId || this.isUpdatingStage || !this.deal) {
      return;
    }

    const oldStage = this.deal.stage;
    this.isUpdatingStage = true;
    
    // Store current customer data before update
    const preservedData = {
      companyName: this.deal.companyName,
      contactName: this.deal.contactName,
      contactEmail: this.deal.contactEmail,
      contactPhone: this.deal.contactPhone,
      companyWebsite: this.deal.companyWebsite,
      companyPhone: this.deal.companyPhone,
      closingDate: this.deal.closingDate
    };
    
    // Update the stage immediately for UI feedback
    this.deal = { ...this.deal, stage: newStage };
    
    this.dealService.updateDealStage(this.dealId, newStage).subscribe({
      next: (updatedDeal) => {
        // Process the updated deal data
        this.processDealData(updatedDeal);
        
        // Restore preserved customer data if it was lost in the update
        if (!this.deal.companyName || this.deal.companyName === 'N/A' || this.deal.companyName === '') {
          this.deal.companyName = preservedData.companyName || this.originalCustomerData.customerName;
        }
        if (!this.deal.contactName) {
          this.deal.contactName = preservedData.contactName || this.originalCustomerData.contactName;
        }
        if (!this.deal.contactEmail || this.deal.contactEmail === '.com') {
          this.deal.contactEmail = preservedData.contactEmail || this.originalCustomerData.contactEmail;
        }
        if (!this.deal.contactPhone) {
          this.deal.contactPhone = preservedData.contactPhone || this.originalCustomerData.contactPhone;
        }
        if (!this.deal.companyWebsite || this.deal.companyWebsite === 'info@.com') {
          this.deal.companyWebsite = preservedData.companyWebsite || this.originalCustomerData.companyWebsite;
        }
        if (!this.deal.companyPhone) {
          this.deal.companyPhone = preservedData.companyPhone || this.originalCustomerData.companyPhone;
        }
        if (!this.deal.closingDate) {
          this.deal.closingDate = preservedData.closingDate;
        }
        
        // Add to history immediately
        this.history.unshift({
          timestamp: this.formatDate(new Date()),
          editedBy: 'Current User', // Replace with actual user from auth service
          fromStage: oldStage,
          toStage: newStage
        });
        
        this.isUpdatingStage = false;
        console.log('Stage updated successfully to:', newStage);
        
        // Refresh stage history from backend
        this.loadStageHistory();
      },
      error: (err) => {
        console.error('Error updating stage:', err);
        alert('Failed to update stage. Please try again.');
        // Revert the UI change
        this.deal = { ...this.deal, stage: oldStage };
        this.isUpdatingStage = false;
      }
    });
  }
 
  onDescriptionChange(newDescription: string) {
    console.log('Updated description:', newDescription);
    
    if (!this.deal || !this.dealId) {
      console.error('No deal or dealId available');
      return;
    }
    
    const oldDescription = this.deal.description;
    
    // Store current customer data before update
    const preservedData = {
      companyName: this.deal.companyName,
      contactName: this.deal.contactName,
      contactEmail: this.deal.contactEmail,
      contactPhone: this.deal.contactPhone,
      companyWebsite: this.deal.companyWebsite,
      companyPhone: this.deal.companyPhone,
      closingDate: this.deal.closingDate,
      title: this.deal.title,
      amount: this.deal.amount,
      startDate: this.deal.startDate,
      salesperson: this.deal.salesperson,
      stage: this.deal.stage
    };
    
    // Update the description immediately for UI feedback
    this.deal.description = newDescription;
    
    // Call the API to update the description
    this.dealService.updateDealDescription(this.dealId, newDescription).subscribe({
      next: (updatedDeal) => {
        console.log('Description update response:', updatedDeal);
        
        // Don't call processDealData - just update description and preserve everything else
        this.deal = {
          ...this.deal,
          description: newDescription,
          // Preserve all the important fields
          companyName: preservedData.companyName,
          contactName: preservedData.contactName,
          contactEmail: preservedData.contactEmail,
          contactPhone: preservedData.contactPhone,
          companyWebsite: preservedData.companyWebsite,
          companyPhone: preservedData.companyPhone,
          closingDate: preservedData.closingDate,
          title: preservedData.title,
          amount: preservedData.amount,
          startDate: preservedData.startDate,
          salesperson: preservedData.salesperson,
          stage: preservedData.stage
        };
        
        // Update the browser history state with the updated deal
        window.history.replaceState({ deal: this.deal }, '');
        
        console.log('Description updated successfully to:', newDescription);
      },
      error: (err) => {
        console.error('Error updating description:', err);
        alert('Failed to update description. Please try again.');
        // Revert the UI change
        this.deal.description = oldDescription;
      }
    });
  }
 
  onDesktopTabSelect(e: any) {
    this.desktopSelectedTabId = e.itemData.id;
  }
}
