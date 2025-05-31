import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { finalize } from 'rxjs/operators';
import { getSupportedInputTypes } from '@angular/cdk/platform';

export interface QuickContactFormData {
  FirstName: string;
  LastName: string;
  companyName: string;
  Email: string;
  phoneNo: string;
}

import { CountryService } from 'src/app/services/country.service';
import { DuService } from 'src/app/services/du.service';
import { RevenuetypeService } from 'src/app/services/revenuetype.service';
import { AccountService } from '../../services/account.service';
import { RegionService } from '../../services/region.service';
import { DomainService } from '../../services/domain.service';
import { DealstageService } from 'src/app/services/dealstage.service';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import{ DealService } from 'src/app/services/dealcreation.service';
import { DealCreatePayload, DealRead } from 'src/app/services/dealcreation.service';
// import { NotificationService } from '../../services/notification.service'; 


@Component({
  selector: 'app-add-deal-modal',
  templateUrl: './add-deal-modal.component.html',
  styleUrls: ['./add-deal-modal.component.css']
})
export class AddDealModalComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('dealFormInstance', { static: false }) dealFormInstance!: DxFormComponent;
  @ViewChild('popupInstanceRef', { static: false }) dxPopupInstance!: DxPopupComponent; // Reference to dx-popup
  @ViewChild('formContainer', { static: false }) formContainer!: ElementRef<HTMLDivElement>; // Reference to the form container

  @Input() isVisible: boolean = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() dealToEdit: DealRead | null = null;
  @Input() selectedStage: number = 1;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmitSuccess = new EventEmitter<DealRead>();
  @Output() onSubmitError = new EventEmitter<string>();

  popupWidth = window.innerWidth < 600 ? '90%' : 500;
  isLoading: boolean = false;
  isFormReady: boolean = false; // Flag to indicate form readiness

  accounts: { id: number; accountName: string }[] = [];
  regions: { id: number; regionName: string }[] = [];
  domains: { id: number; domainName: string }[] = [];
  dealStages: { id: number; displayName: string; stageName?: string; }[] = [];
  revenueTypes: { id: number; revenueTypeName: string }[] = [];
  dus: { id: number; duName: string }[] = [];
  countries: { id: number; countryName: string }[] = [];
  
  companies: string[] = [];
  companyContactMap: { [company: string]: string[] } = {};
  filteredCompanies: string[] = [];
  filteredContacts: string[] = [];

  newDeal = {
     amount: 0, companyName: '', title: '',
    account: null as number | null, region: null as number | null, contactName: '',
    domain: null as number | null, stage: null as number | null, revenueType: null as number | null,
    department: null as number | null, country: null as number | null,
    startDate: null as Date | null, closeDate: null as Date | null,
    description: '', probability: null as number | null,
  };

  isCompanyModalVisible: boolean = false;
  companyData = { companyName: '', phoneNo: '', website: '' };
  companyFields = [
    { dataField: 'companyName', label: 'Company Name', required: true },
    { dataField: 'phoneNo', label: 'Phone Number', required: true },
    { dataField: 'website', label: 'Website', required: true }
  ];

  isContactModalVisible: boolean = false;
  contactData: QuickContactFormData = { FirstName: '', LastName: '', companyName: '', Email: '', phoneNo: '' };
  contactFields = [
    { dataField: 'FirstName', label: 'First Name', required: true },
    { dataField: 'LastName', label: 'Last Name', required: false },
    { dataField: 'companyName', label: 'Company Name', editorOptions: { disabled: true }, required: true },
    { dataField: 'Email', label: 'Email', required: false },
    { dataField: 'phoneNo', label: 'Phone Number', required: true }
  ];

  isCustomizeFieldModalVisible: boolean = false;
  customizeFieldFormData: any = {};
  customizeFieldModalFields = [
    { dataField: 'fieldLabel', label: 'Field Label', required: true },
    { dataField: 'fieldType', label: 'Field Type', editorType: 'dxSelectBox', editorOptions: { items: ['Text', 'Numerical', 'Boolean', 'Date'], placeholder: 'Select field type' }, required: true }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private regionService: RegionService,
    private domainService: DomainService,
    private dealStageService: DealstageService,
    private countryService: CountryService,
    private duService: DuService,
    private revenuetypeService: RevenuetypeService,
    private companyContactService: CompanyContactService,
    private dealService: DealService,
    // private notificationService: NotificationService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.popupWidth = event.target.innerWidth < 600 ? '90%' : 500;
  }

  ngOnInit() {
    console.log('AddDealModal ngOnInit - dealFormInstance:', this.dealFormInstance); // Expected: undefined
    this.loadDropdownData();
    // Initial form state based on mode (will be refined in ngOnChanges and AfterViewInit for popup events)
    if (this.mode === 'edit' && this.dealToEdit) {
      this.prefillFormForEdit(this.dealToEdit);
    } else {
      this.resetForm();
    }
  }

  ngAfterViewInit() {
    console.log('AddDealModal ngAfterViewInit - dealFormInstance:', this.dealFormInstance); // Might be undefined if popup defers content

    if (this.dxPopupInstance && this.dxPopupInstance.instance) {
      this.dxPopupInstance.instance.on('shown', () => {
        console.log('DxPopup "shown" event. Current dealFormInstance:', this.dealFormInstance);
        this.cdr.detectChanges(); // Nudge Angular to pick up ViewChildren within popup content

        if (this.dealFormInstance && this.dealFormInstance.instance) {
          this.isFormReady = true;
          console.log('Form is now marked as ready.');
        } else {
          console.error('CRITICAL: dealFormInstance is NOT available even after popup "shown" and detectChanges. Check #dealFormInstance in template.');
          // this.notificationService.showError('Form failed to initialize. Please try again.');
          alert('Form failed to initialize. Please try again.');
        }
        this.cdr.detectChanges(); // Update bindings that depend on isFormReady (e.g. button state)
      });

      this.dxPopupInstance.instance.on('hiding', () => {
        this.isFormReady = false; // Reset when popup hides
        console.log('Form is marked as not ready (popup hiding).');
        this.cdr.detectChanges();
      });
    } else {
        console.warn('dxPopupInstance is not available in ngAfterViewInit. Popup events cannot be subscribed.');
    }
  }

  // Add a handler to enable mouse wheel scrolling
  onMouseWheel(event: WheelEvent) {
    if (this.formContainer && this.formContainer.nativeElement) {
      const container = this.formContainer.nativeElement;
      // Scroll the form container based on the mouse wheel delta
      container.scrollTop += event.deltaY;
      event.preventDefault(); // Prevent the default page scroll
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
        if (this.isVisible) {
            // When modal becomes visible, form is not immediately ready until 'shown' event
            this.isFormReady = false; 
            console.log('Modal became visible (isVisible=true), form marked as NOT ready initially.');
            if (this.mode === 'edit' && this.dealToEdit) {
                this.prefillFormForEdit(this.dealToEdit);
            } else {
                this.resetForm(); // Reset form data, but isFormReady is still false
            }
        } else {
            // When modal is hidden programmatically (isVisible becomes false)
            this.isFormReady = false;
             console.log('Modal became hidden (isVisible=false), form marked as NOT ready.');
        }
    }
    if (changes['dealToEdit'] && this.isVisible && this.mode === 'edit' && this.dealToEdit) {
        this.prefillFormForEdit(this.dealToEdit);
    }
  }

  loadDropdownData() { /* ... same as before ... */ 
    this.loadAccounts(); this.loadRegions(); this.loadDomains(); this.loadStages();
    this.loadDus(); this.loadRevenueTypes(); this.loadCountries(); this.loadCompanyContactData();
  }
  loadAccounts() { this.accountService.getAllAccounts().subscribe(data => this.accounts = data, err => console.error('Error accounts', err)); }
  loadRegions() { this.regionService.getAllRegions().subscribe(data => this.regions = data, err => console.error('Error regions', err)); }
  loadDomains() { this.domainService.getAllDomains().subscribe(data => this.domains = data, err => console.error('Error domains', err)); }
  loadStages() { this.dealStageService.getAllDealStages().subscribe(data => this.dealStages = data.map(s => ({...s, displayName: s.displayName || s.stageName!})), err => console.error('Error stages', err)); }
  loadDus() { this.duService.getDU().subscribe(data => this.dus = data, err => console.error('Error DUs', err)); }
  loadRevenueTypes() { this.revenuetypeService.getRevenueTypes().subscribe(data => this.revenueTypes = data, err => console.error('Error revenue types', err)); }
  loadCountries() { this.countryService.getCountries().subscribe(data => this.countries = data, err => console.error('Error countries', err)); }
  loadCompanyContactData() {
    this.companyContactService.getCompanyContactMap().subscribe(data => {
      this.companyContactMap = data; this.companies = Object.keys(data);
      this.filteredCompanies = [...this.companies];
      if (this.newDeal.companyName) { this.filteredContacts = this.companyContactMap[this.newDeal.companyName] || []; }
      this.cdr.detectChanges();
    }, err => console.error('Error company/contact map', err));
  }

  prefillFormForEdit(deal: DealRead) { /* ... same as before ... */ 
    const parseDate = (dateStr: string | null | undefined): Date | null => dateStr ? new Date(dateStr) : null;
    this.newDeal = {
      amount: deal.dealAmount || 0, companyName: '', title: deal.dealName || '',
      account: deal.accountId || null, region: deal.regionId || null, contactName: deal.contactName || '',
      domain: deal.domainId || null, stage: deal.dealStageId || null, revenueType: deal.revenueTypeId || null,
      department: deal.duId || null, country: deal.countryId || null,
      startDate: parseDate(deal.startingDate), closeDate: parseDate(deal.closingDate),
      description: deal.description || '', probability: deal.probability || null,
    };
    if (deal.contactName && this.companyContactMap) {
        for (const compName of Object.keys(this.companyContactMap)) {
            if (this.companyContactMap[compName].includes(deal.contactName)) { this.newDeal.companyName = compName; break; }
        }
    }
    this.onCompanyChange(this.newDeal.companyName, false);
    this.cdr.detectChanges();
  }

  get modalTitle(): string { return this.mode === 'edit' ? 'Edit Deal' : 'Create Deal'; }

  handleClose() {
    this.isFormReady = false; // Ensure form is marked not ready
    this.onClose.emit();
    this.resetForm(); // resetForm also sets isLoading to false
  }

  handleSubmit() {
    console.log('handleSubmit CALLED - isFormReady:', this.isFormReady, 'dealFormInstance:', this.dealFormInstance);
    if (!this.isFormReady || !this.dealFormInstance || !this.dealFormInstance.instance) {
      let message = "The form is not ready for submission. ";
      if (!this.isFormReady) message += "Popup content might not be fully initialized. ";
      if (!this.dealFormInstance || !this.dealFormInstance.instance) message += "Form component reference is missing. ";
      
      console.error(message + "Please wait a moment. If the problem persists, try closing and reopening the modal.");
      alert(message + "Please wait a moment. If the problem persists, try closing and reopening the modal.");
      this.onSubmitError.emit('Form not ready for submission.');
      this.isLoading = false; // Ensure isLoading is reset
      return;
    }

    const validationResult = this.dealFormInstance.instance.validate();
    if (!validationResult.isValid) {
      alert('Please correct the validation errors before saving.');
      this.onSubmitError.emit('Validation failed. Please check the form.');
      return; // isLoading will be handled by finalize if an API call was intended
    }

    if (this.mode === 'edit') {
      console.warn('Edit mode handleSubmit not fully implemented.');
      // this.updateExistingDeal(); 
      return;
    }

    this.isLoading = true;

    if (!this.newDeal.region || !this.newDeal.stage || !this.newDeal.revenueType || !this.newDeal.department || !this.newDeal.country) {
        const missing = [!this.newDeal.region?"Region":null, !this.newDeal.stage?"Stage":null, !this.newDeal.revenueType?"Revenue Type":null, !this.newDeal.department?"DU":null, !this.newDeal.country?"Country":null].filter(Boolean).join(', ');
        alert(`Required fields missing: ${missing}`); this.isLoading = false; this.onSubmitError.emit(`Required fields missing: ${missing}`); return;
    }
    if (!this.newDeal.startDate || !this.newDeal.closeDate) {
        alert("Starting and Closing dates are required."); this.isLoading = false; this.onSubmitError.emit("Starting and Closing dates are required."); return;
    }

    const dealPayload: DealCreatePayload = {
      title: this.newDeal.title, amount: this.newDeal.amount, companyName: this.newDeal.companyName,
      contactFullName: this.newDeal.contactName, 
      accountId: this.newDeal.account, regionId: this.newDeal.region as number, domainId: this.newDeal.domain,
      dealStageId: this.newDeal.stage as number, revenueTypeId: this.newDeal.revenueType as number,
      duId: this.newDeal.department as number, countryId: this.newDeal.country as number,
      description: this.newDeal.description, probability: this.newDeal.probability,
      startingDate: this.newDeal.startDate.toISOString(), closingDate: this.newDeal.closeDate.toISOString(),
      createdBy: 1 
    };

    this.dealService.createDeal(dealPayload)
      .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (createdDeal: DealRead) => {
          alert('Deal created successfully!'); this.onSubmitSuccess.emit(createdDeal); this.handleClose();
        },
        error: (err: Error) => {
          console.error('Error creating deal:', err.message, err);
          alert(`Error: ${err.message || 'Failed to create deal. Please try again.'}`);
          this.onSubmitError.emit(err.message || 'Failed to create deal. Please try again.');
        }
      });
  }

  resetForm() { /* ... same as before ... */ 
    this.newDeal = {
       amount: 0, companyName: '', title: '', account: null, region: null, contactName: '',
      domain: null, stage: null, revenueType: null, department: null, country: null,
      startDate: null, closeDate: null, description: '', probability: null,
    };
    if (this.companies && this.companies.length > 0) { this.filteredCompanies = [...this.companies]; } 
    else { this.filteredCompanies = []; }
    this.filteredContacts = [];
    this.isLoading = false;
    // isFormReady is handled by popup events and ngOnChanges, not directly in resetForm unless it's part of closing logic
    this.dealFormInstance?.instance.resetValues();
    this.cdr.detectChanges();
  }

  onCompanyChange(companyName: string, clearContact: boolean = true) { /* ... same as before ... */ 
    this.newDeal.companyName = companyName; this.filteredContacts = this.companyContactMap[companyName] || [];
    if (clearContact || !this.filteredContacts.includes(this.newDeal.contactName)) { this.newDeal.contactName = ''; }
    this.cdr.detectChanges();
  }
  onContactChange(contactName: string) { this.newDeal.contactName = contactName; }

  openQuickCreateCompanyModal() { /* ... same as before ... */ this.companyData = { companyName: '', phoneNo: '', website: '' }; this.isCompanyModalVisible = true; }
  closeQuickCreateCompanyModal() { this.isCompanyModalVisible = false; }
  addNewCompany(newCompanyData: { companyName: string; phoneNo: string; website: string; }) { /* ... same as before, ensure isLoading is handled ... */ 
    const payload = { companyName: newCompanyData.companyName, website: newCompanyData.website, companyPhoneNumber: newCompanyData.phoneNo, createdBy: 1 };
    this.isLoading = true;
    this.companyContactService.addCompany(payload).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => { alert('Company added!'); this.loadCompanyContactData(); this.newDeal.companyName = payload.companyName; this.onCompanyChange(payload.companyName); this.closeQuickCreateCompanyModal(); },
      error: (err) => { console.error('Company creation failed:', err); alert(err.message || 'Failed to create company.'); }
    });
  }

  openQuickCreateContactModal() { /* ... same as before ... */ 
    if (!this.newDeal.companyName) { alert('Please select a company first.'); return; }
    this.contactData = { FirstName: '', LastName: '', companyName: this.newDeal.companyName, Email: '', phoneNo: '' };
    this.isContactModalVisible = true;
  }
  closeQuickCreateContactModal() { this.isContactModalVisible = false; }
  addNewContact(newContactData: QuickContactFormData) { /* ... same as before, ensure isLoading is handled ... */ 
    const payload = { firstName: newContactData.FirstName, lastName: newContactData.LastName || '', email: newContactData.Email, phoneNumber: newContactData.phoneNo, companyName: this.newDeal.companyName, createdBy: 1 };
    this.isLoading = true;
    this.companyContactService.addContact(payload).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        alert('Contact added!'); this.loadCompanyContactData(); const fullName = `${payload.firstName} ${payload.lastName}`.trim();
        setTimeout(() => { this.newDeal.contactName = fullName; this.onCompanyChange(this.newDeal.companyName, false); this.cdr.detectChanges(); }, 300);
        this.closeQuickCreateContactModal();
      },
      error: (err) => { console.error('Contact creation failed:', err); alert(err.message || 'Failed to create contact.'); }
    });
  }

  openCustomizeFieldModal() { /* ... same as before ... */ this.customizeFieldFormData = {}; this.isCustomizeFieldModalVisible = true; }
  closeCustomizeFieldModal() { this.isCustomizeFieldModalVisible = false; }
  addCustomField(newField: any) { /* ... same as before ... */ console.log('Custom Field Added:', newField); this.closeCustomizeFieldModal(); }
}