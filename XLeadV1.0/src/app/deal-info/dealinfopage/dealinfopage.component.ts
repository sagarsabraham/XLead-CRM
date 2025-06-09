import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DealService } from 'src/app/services/dealcreation.service';
import { DealstageService } from 'src/app/services/dealstage.service';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import { forkJoin, of } from 'rxjs';


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
    private dealStageService: DealstageService,
      private companyContactService: CompanyContactService  
  ) {}
 
ngOnInit() { 
  console.log('=== DEAL INFO PAGE INIT ===');
  this.checkScreenSize();
  this.loadStages();
  
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state || window.history.state;
  
  console.log('Navigation state:', state);
  
  if (state && state.deal) {
    console.log('Deal found in state:', state.deal);
    console.log('Stage from state:', state.deal.stageName);
    this.dealId = state.deal.id;
 
    this.processDealDataWithContactInfo(state.deal);  
    this.loadStageHistory();
  } else {
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
        this.processDealDataWithContactInfo(dealData);
        this.loadStageHistory();
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
  console.log('Processing deal data:', dealData);
  
  let stageName = dealData.stageName || 
                  dealData.stage || 
                  dealData.dealStage || 
                  dealData.currentStage ||
                  dealData.stageDisplayName;
  
  console.log('Stage name found:', stageName);

  this.deal = {
    id: dealData.id || dealData.dealId,
    title: dealData.dealName || dealData.title,
    startDate: dealData.startingDate || dealData.startDate,
    closingDate: dealData.closingDate || dealData.expectedClosingDate || dealData.date,
    amount: dealData.dealAmount || dealData.amount,
    companyName: dealData.companyName || dealData.customerName,
    contactName: dealData.contactName,
    contactEmail: '', 
    contactPhone: '',
    salesperson: dealData.salespersonName || dealData.salesperson,
    stage: stageName || 'Qualification',
    description: dealData.description || '',
    companyWebsite: '', 
    companyPhone: '', 
    probability: dealData.probability,
    region: dealData.regionName || dealData.region,
    domain: dealData.domainName || dealData.domain,
    revenueType: dealData.revenueTypeName || dealData.revenueType,
    du: dealData.duName || dealData.du,
    country: dealData.countryName || dealData.country,
    createdAt: dealData.createdAt || dealData.startingDate || new Date(),
    contactId: dealData.contactId,
    accountId: dealData.accountId
  };
  
  this.dealId = dealData.id || dealData.dealId;
}


processDealDataWithContactInfo(dealData: any) {
  console.log('Processing deal data with contact info:', dealData);
  

  this.processDealData(dealData);
  
  
  const contactName = dealData.contactName;
  const companyName = dealData.accountName || dealData.customerName;
  
  console.log('Looking for contact:', contactName, 'and company:', companyName);
  
  if (contactName) {
  
    this.companyContactService.getContacts().subscribe(contacts => {
      console.log('All available contacts:', contacts);
      
      const matchingContact = contacts.find((c: any) => 
        `${c.firstName} ${c.lastName}`.toLowerCase() === contactName.toLowerCase()
      );
      
      if (matchingContact) {
        console.log('Found matching contact:', matchingContact);
        
        
        this.deal.contactName = `${matchingContact.firstName} ${matchingContact.lastName}`;
        this.deal.contactEmail = matchingContact.email;
        this.deal.contactPhone = matchingContact.phoneNumber;
        
      
        this.companyContactService.getCompanies().subscribe(companies => {
          console.log('All available companies:', companies);
          
          const customerCompany = companies.find((c: any) => c.id === matchingContact.customerId);
          
          if (customerCompany) {
            console.log('Found customer company:', customerCompany);
            this.deal.companyName = customerCompany.customerName;
            this.deal.companyWebsite = customerCompany.website;
            this.deal.companyPhone = customerCompany.customerPhoneNumber;
          } else {
            console.log('No company found for customerId:', matchingContact.customerId);
           
            const fallbackCompany = companies.find((c: any) => 
              c.customerName.toLowerCase() === companyName.toLowerCase()
            );
            if (fallbackCompany) {
              this.deal.companyName = fallbackCompany.customerName;
              this.deal.companyWebsite = fallbackCompany.website;
              this.deal.companyPhone = fallbackCompany.customerPhoneNumber;
            }
          }
          
          this.isLoading = false;
        });
      } else {
        console.log('No matching contact found for:', contactName);
        this.isLoading = false;
      }
    });
  } else {
    console.log('No contact name provided in deal data');
    this.isLoading = false;
  }
}


  private formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      console.warn('Invalid date detected, using current date');
      date = new Date();
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
processStageHistory(history: any[]) {
  this.history = [];
  
  // First, check if we have any stage history from the backend
  const hasBackendHistory = history && history.length > 0;
  
  if (hasBackendHistory) {
    // Sort history by date (oldest first) to process in chronological order
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.timestamp);
      const dateB = new Date(b.createdAt || b.timestamp);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Check if the first entry is the initial stage
    const firstEntry = sortedHistory[0];
    const isFirstEntryInitial = !firstEntry.fromStage || firstEntry.fromStage === 'Initial';
    
    if (isFirstEntryInitial) {
     
      const date = new Date(firstEntry.createdAt || firstEntry.timestamp);
      
     
      const creatorName = firstEntry.createdBy || 'Unknown User';
      
      this.history.push({
        timestamp: this.formatDate(date),
        editedBy: creatorName,  // Same field used in stage updates
        fromStage: '',
        toStage: '',
        isCreation: true,
        dealName: this.deal?.title || this.deal?.dealName || 'New Deal'
      });
      

      let previousStage = firstEntry.stageDisplayName || firstEntry.stageName || firstEntry.toStage || 'Qualification';
      
      for (let i = 1; i < sortedHistory.length; i++) {
        const entry = sortedHistory[i];
        const date = new Date(entry.createdAt || entry.timestamp);
        const toStage = entry.stageDisplayName || entry.stageName || entry.toStage;
        
        this.history.push({
          timestamp: this.formatDate(date),
          editedBy: entry.createdBy || 'Unknown User',  // Same logic
          fromStage: entry.fromStage || previousStage,
          toStage: toStage,
          isCreation: false
        });
        
        previousStage = toStage;
      }
    } else {
     
      let previousStage = 'Qualification';
      
      sortedHistory.forEach((entry) => {
        const date = new Date(entry.createdAt || entry.timestamp);
        const toStage = entry.stageDisplayName || entry.stageName || entry.toStage;
        
        this.history.push({
          timestamp: this.formatDate(date),
          editedBy: entry.createdBy || 'Unknown User',  // Same logic
          fromStage: entry.fromStage || previousStage,
          toStage: toStage,
          isCreation: false
        });
        
        previousStage = toStage;
      });
    }
  } else {
   
    console.log('No stage history available from backend');
  }
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
  

  const preservedData = { ...this.deal };
  
  
  this.deal = { ...this.deal, stage: newStage };
  
  this.dealService.updateDealStage(this.dealId, newStage).subscribe({
    next: (updatedDeal) => {
      
      this.deal = {
        ...preservedData,
        stage: newStage
      };
      
      
      this.history.unshift({
        timestamp: this.formatDate(new Date()),
        editedBy: 'Current User', 
        fromStage: oldStage, 
        toStage: newStage,
        isCreation: false
      });
      
      this.isUpdatingStage = false;
      console.log('Stage updated from', oldStage, 'to', newStage);
      
     
      this.loadStageHistory();
    },
    error: (err) => {
      console.error('Error updating stage:', err);
      alert('Failed to update stage. Please try again.');
      
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
