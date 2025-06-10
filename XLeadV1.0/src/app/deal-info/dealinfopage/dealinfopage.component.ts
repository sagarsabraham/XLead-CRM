import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DealService } from 'src/app/services/dealcreation.service';
import { DealstageService } from 'src/app/services/dealstage.service';
 import { CompanyContactService } from 'src/app/services/company-contact.service';
 import { DxToastComponent } from 'devextreme-angular';
 
@Component({
  selector: 'app-dealinfopage',
  templateUrl: './dealinfopage.component.html',
  styleUrls: ['./dealinfopage.component.css']
})
export class DealinfopageComponent implements OnInit {
  @ViewChild('toastInstance', { static: false }) toastInstance!: DxToastComponent;
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

  toastMessage: string = '';
  toastType: 'info' | 'success' | 'error' | 'warning' = 'info';
  toastVisible: boolean = false;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService,
    private dealStageService: DealstageService,
    private companyContactService: CompanyContactService,
    private cdr: ChangeDetectorRef
  ) {}

  showToast(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cdr.detectChanges();
  }
 
  ngOnInit() {
    console.log('=== DEAL INFO PAGE INIT ===');
    this.checkScreenSize();
    this.loadStages();
 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || window.history.state;
    this.processDealDataWithContactInfo(state.deal);  
   
    console.log('Navigation state:', state);
   
    if (state && state.deal) {
      console.log('Deal found in state:', state.deal);
      console.log('Stage from state:', state.deal.stageName);
      this.dealId = state.deal.id;
      this.processDealData(state.deal);
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
        this.processDealData(dealData);
        this.loadStageHistory();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading deal:', err);
        this.showToast('Failed to load deal data.', 'error');
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
        this.processStageHistory([]);
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
 
  if (!this.deal) {
    console.error("processStageHistory called before deal data is available.");
    return;
  }
 
  const sortedHistory = history ? [...history].sort((a, b) =>
    new Date(a.createdAt || a.timestamp).getTime() - new Date(b.createdAt || b.timestamp).getTime()
  ) : [];
 
  let trueInitialStage;
  if (sortedHistory.length > 0) {
    trueInitialStage = sortedHistory[0].fromStage || 'Qualification';
  } else {
    trueInitialStage = this.deal.stage;
  }
 
  const creationTimestamp = this.deal.createdAt ? new Date(this.deal.createdAt) : new Date();
 
  this.history.push({
    isInitial: true,
    timestamp: this.formatDate(creationTimestamp),
    fromStage: `Deal '${this.deal.title}' created`,
    toStage: trueInitialStage
  });
 
  let previousStage = trueInitialStage;
 
  sortedHistory.forEach(entry => {
    const toStage = entry.stageDisplayName || entry.stageName || entry.toStage;
    const fromStage = entry.fromStage || previousStage;
 
    if (fromStage !== toStage) {
      this.history.push({
        isInitial: false,
        timestamp: this.formatDate(new Date(entry.createdAt || entry.timestamp)),
        editedBy: entry.createdBy || entry.editedBy || 'Unknown User',
        fromStage: fromStage,
        toStage: toStage
      });
    }
 
    previousStage = toStage;
  });
 
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
   
    const preservedData = {
      companyName: this.deal.companyName,
      contactName: this.deal.contactName,
      contactEmail: this.deal.contactEmail,
      contactPhone: this.deal.contactPhone,
      companyWebsite: this.deal.companyWebsite,
      companyPhone: this.deal.companyPhone,
      closingDate: this.deal.closingDate
    };
    this.deal = { ...this.deal, stage: newStage };
   
    this.dealService.updateDealStage(this.dealId, newStage).subscribe({
      next: (updatedDeal) => {
        this.processDealData(updatedDeal);
       
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
       
        this.history.unshift({
          timestamp: this.formatDate(new Date()),
          editedBy: 'Current User', 
          fromStage: oldStage,
          toStage: newStage
        });
       
        this.isUpdatingStage = false;
        console.log('Stage updated successfully to:', newStage);
        this.showToast('Stage updated successfully.', 'success');
       
        this.loadStageHistory();
      },
      error: (err) => {
        console.error('Error updating stage:', err);
        this.showToast('Failed to update stage. Please try again.', 'error');
        this.deal = { ...this.deal, stage: oldStage };
        this.isUpdatingStage = false;
      }
    });
  }
 
  onDescriptionChange(newDescription: string) {
    console.log('Updated description:', newDescription);
   
    if (!this.deal || !this.dealId) {
      console.error('No deal or dealId available');
      this.showToast('No deal data available.', 'error');
      return;
    }
   
    const oldDescription = this.deal.description;
   
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
   
    this.deal.description = newDescription;
   
    this.dealService.updateDealDescription(this.dealId, newDescription).subscribe({
      next: (updatedDeal) => {
        console.log('Description update response:', updatedDeal);
       
        this.deal = {
          ...this.deal,
          description: newDescription,
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
       
        window.history.replaceState({ deal: this.deal }, '');
       
        console.log('Description updated successfully to:', newDescription);
        this.showToast('Description updated successfully.', 'success');
      },
      error: (err) => {
        console.error('Error updating description:', err);
        this.showToast('Failed to update description. Please try again.', 'error');        this.deal.description = oldDescription;
      }
    });
  }
 
  onDesktopTabSelect(e: any) {
    this.desktopSelectedTabId = e.itemData.id;
  }
}
 
 