import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { finalize } from 'rxjs/operators';


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
import { DxValidationRule } from '../form-modal/form-modal.component';



@Component({
  selector: 'app-add-deal-modal',
  templateUrl: './add-deal-modal.component.html',
  styleUrls: ['./add-deal-modal.component.css']
})
export class AddDealModalComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('dealFormInstance', { static: false }) dealFormInstance!: DxFormComponent;
  @ViewChild('popupInstanceRef', { static: false }) dxPopupInstance!: DxPopupComponent; 

  @Input() isVisible: boolean = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() dealToEdit: DealRead | null = null;
  @Input() selectedStage: number = 1;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmitSuccess = new EventEmitter<DealRead>();
  @Output() onSubmitError = new EventEmitter<string>();
countryCodes: { code: string; name: string }[] = [
    { code: '+91', name: 'India (+91)' },
    { code: '+1', name: 'United States (+1)' },
    { code: '+44', name: 'United Kingdom (+44)' },
    { code: '+81', name: 'Japan (+81)' },
    // Add more country codes as needed
  ];
  popupWidth = window.innerWidth < 600 ? '90%' : 500;
  isLoading: boolean = false;
  isFormReady: boolean = false; 

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
  companyFields: {
    dataField: string;
    label: string;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[]; // Use the imported type
  }[] = [
    {
      dataField: 'companyName',
      label: 'Company Name',
      validationRules: [
        { type: 'required', message: 'Company Name is required' },
        { type: 'stringLength', min: 2, message: 'Company Name must be at least 2 characters long' }
      ]
    },
   {
  dataField: 'phoneNo',
  label: 'Phone Number',
  editorType: 'dxTextBox',
  editorOptions: {
    mask: '+91 00000-00000',
    maskRules: { "0": /[0-9]/ }
  },
  validationRules: [
    { type: 'required', message: 'Phone Number is required' },
    {
      type: 'pattern',
      pattern: /^\+?91?\s?\d{5}\s?-?\d{5}$/,
      message: 'Invalid Indian phone number format. Use +91 followed by 10 digits or 10 digits starting with 6, 7, 8, or 9.'
    },
    // {
    //   type: 'pattern',
    //   pattern: /^[6-9]\d{9}$|^(\+91)\s?\d{5}\s?-?\d{5}$/,
    //   message: 'Phone number must start with 6, 7, 8, or 9 if no country code is provided.'
    // }
  ]
},
    {
      dataField: 'website',
      label: 'Website',
      validationRules: [
        { type: 'required', message: 'Website is required' },
        // Basic pattern for a URL. For stricter validation, a custom rule might be better.
        { type: 'pattern', pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, message: 'Invalid website URL format' }
      ]
    }
  ];

  isContactModalVisible: boolean = false;
  contactData: QuickContactFormData = { FirstName: '', LastName: '', companyName: '', Email: '', phoneNo: '' };
 contactFields: {
    dataField: string;
    label: string;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[]; // Use the imported type
  }[] = [
    {
      dataField: 'FirstName',
      label: 'First Name',
      validationRules: [
        { type: 'required', message: 'First Name is required' },
        { type: 'stringLength', min: 2, message: 'First Name must be at least 2 characters' }
      ]
    },
    {
      dataField: 'LastName',
      label: 'Last Name',
      // Not required, but if provided, maybe a min length
      validationRules: [
         { type: 'stringLength', min: 2, message: 'Last Name must be at least 2 characters if provided' }
      ]
    },
    {
      dataField: 'companyName',
      label: 'Company Name',
      editorOptions: { disabled: true }, // Stays disabled
      validationRules: [
        { type: 'required', message: 'Company Name is required (should be auto-filled)' }
      ]
    },
    {
      dataField: 'Email',
      label: 'Email',
      editorType: 'dxTextBox',
      editorOptions: { mode: 'email' },
      validationRules: [
        // Not strictly required, but if entered, must be valid email format
        { type: 'email', message: 'Invalid email format' }
      ]
    },
       {
  dataField: 'phoneNo',
  label: 'Phone Number',
  editorType: 'dxTextBox',
  editorOptions: {
    mask: '+91 00000-00000',
    maskRules: { "0": /[0-9]/ }
  },
  validationRules: [
    { type: 'required', message: 'Phone Number is required' },
    {
      type: 'pattern',
      pattern: /^\+?91?\s?\d{5}\s?-?\d{5}$/,
      message: 'Invalid Indian phone number format. Use +91 followed by 10 digits or 10 digits starting with 6, 7, 8, or 9.'
    },
    // {
    //   type: 'pattern',
    //   pattern: /^[6-9]\d{9}$|^(\+91)\s?\d{5}\s?-?\d{5}$/,
    //   message: 'Phone number must start with 6, 7, 8, or 9 if no country code is provided.'
    // }
  ]
},
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
validateCloseDate = (e: any) => {
  return !this.newDeal.startDate || !e.value || new Date(e.value) >= new Date(this.newDeal.startDate);
}
currencyFormat = {
  type: 'fixedPoint',
  precision: 2  // or 0 if you want only whole numbers
};


  ngOnInit() {
   
    this.loadDropdownData();
    // Initial form state based on mode (will be refined in ngOnChanges and AfterViewInit for popup events)
    if (this.mode === 'edit' && this.dealToEdit) {
      this.prefillFormForEdit(this.dealToEdit);
    } else {
      this.resetForm();
    }
  }

  ngAfterViewInit() {
   

    if (this.dxPopupInstance && this.dxPopupInstance.instance) {
      this.dxPopupInstance.instance.on('shown', () => {
       
        this.cdr.detectChanges();
        if (this.dealFormInstance && this.dealFormInstance.instance) {
          this.isFormReady = true;
         
        } else {
         
          
          alert('Form failed to initialize. Please try again.');
        }
        this.cdr.detectChanges();
      });

      this.dxPopupInstance.instance.on('hiding', () => {
       
        this.cdr.detectChanges();
      });
    } 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
        if (this.isVisible) {
            
            this.isFormReady = false; 
           
            if (this.mode === 'edit' && this.dealToEdit) {
                this.prefillFormForEdit(this.dealToEdit);
            } else {
                this.resetForm(); 
            }
        } else {
           
            this.isFormReady = false;
            
        }
    }
    if (changes['dealToEdit'] && this.isVisible && this.mode === 'edit' && this.dealToEdit) {
        this.prefillFormForEdit(this.dealToEdit);
    }
  }

  loadDropdownData() { 
    this.loadAccounts(); this.loadRegions(); this.loadDomains(); this.loadStages();
    this.loadDus(); this.loadRevenueTypes(); this.loadCountries(); this.loadCompanyContactData();
  }
  loadAccounts() { this.accountService.getAllAccounts().subscribe(data => this.accounts = data); }
  loadRegions() { this.regionService.getAllRegions().subscribe(data => this.regions = data); }
  loadDomains() { this.domainService.getAllDomains().subscribe(data => this.domains = data); }
  loadStages() { this.dealStageService.getAllDealStages().subscribe(data => this.dealStages = data.map(s => ({...s, displayName: s.displayName || s.stageName!}))); }
  loadDus() { this.duService.getDU().subscribe(data => this.dus = data); }
  loadRevenueTypes() { this.revenuetypeService.getRevenueTypes().subscribe(data => this.revenueTypes = data); }
  loadCountries() { this.countryService.getCountries().subscribe(data => this.countries = data); }
  loadCompanyContactData() {
    this.companyContactService.getCompanyContactMap().subscribe(data => {
      this.companyContactMap = data; this.companies = Object.keys(data);
      this.filteredCompanies = [...this.companies];
      if (this.newDeal.companyName) { this.filteredContacts = this.companyContactMap[this.newDeal.companyName] || []; }
      this.cdr.detectChanges();
    });
  }

  prefillFormForEdit(deal: DealRead) { 
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
    this.isFormReady = false; 
    this.onClose.emit();
    this.resetForm(); 
  }

  handleSubmit() {
    
    if (!this.isFormReady || !this.dealFormInstance || !this.dealFormInstance.instance) {
      let message = "The form is not ready for submission. ";
      if (!this.isFormReady) message += "Popup content might not be fully initialized. ";
      if (!this.dealFormInstance || !this.dealFormInstance.instance) message += "Form component reference is missing. ";
      
     
      alert(message + "Please wait a moment. If the problem persists, try closing and reopening the modal.");
      this.onSubmitError.emit('Form not ready for submission.');
      this.isLoading = false;
      return;
    }

    const validationResult = this.dealFormInstance.instance.validate();
    if (!validationResult.isValid) {
      alert('Please correct the validation errors before saving.');
      this.onSubmitError.emit('Validation failed. Please check the form.');
      return; 
    }

    if (this.mode === 'edit') {
      console.warn('Edit mode handleSubmit not fully implemented.');
     
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
         
          alert(`Error: ${err.message || 'Failed to create deal. Please try again.'}`);
          this.onSubmitError.emit(err.message || 'Failed to create deal. Please try again.');
        }
      });
  }

  resetForm() {
    this.newDeal = {
       amount: 0, companyName: '', title: '', account: null, region: null, contactName: '',
      domain: null, stage: null, revenueType: null, department: null, country: null,
      startDate: null, closeDate: null, description: '', probability: null,
    };
    if (this.companies && this.companies.length > 0) { this.filteredCompanies = [...this.companies]; } 
    else { this.filteredCompanies = []; }
    this.filteredContacts = [];
    this.isLoading = false;
   
    this.dealFormInstance?.instance.resetValues();
    this.cdr.detectChanges();
  }

  onCompanyChange(companyName: string, clearContact: boolean = true) { 
    this.newDeal.companyName = companyName; this.filteredContacts = this.companyContactMap[companyName] || [];
    if (clearContact || !this.filteredContacts.includes(this.newDeal.contactName)) { this.newDeal.contactName = ''; }
    this.cdr.detectChanges();
  }
  onContactChange(contactName: string) { this.newDeal.contactName = contactName; }

  openQuickCreateCompanyModal() {  this.companyData = { companyName: '', phoneNo: '', website: '' }; this.isCompanyModalVisible = true; }
  closeQuickCreateCompanyModal() { this.isCompanyModalVisible = false; }
 addNewCompany(newCompanyData: { companyName: string; phoneNo: string; website: string; }) {
    // If FormModal's handleSubmit validated, we can proceed
    const payload = { companyName: newCompanyData.companyName, website: newCompanyData.website, companyPhoneNumber: newCompanyData.phoneNo, createdBy: 1 };
    // ... rest of your existing logic ...
    this.isLoading = true;
    this.companyContactService.addCompany(payload).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {  this.loadCompanyContactData(); this.newDeal.companyName = payload.companyName; this.onCompanyChange(payload.companyName); this.closeQuickCreateCompanyModal(); },
      error: (err) => { console.error('Company creation failed:', err); alert(err.message || 'Failed to create company.'); }
    });
  }

  openQuickCreateContactModal() {
    if (!this.newDeal.companyName) { alert('Please select a company first.'); return; }
    this.contactData = { FirstName: '', LastName: '', companyName: this.newDeal.companyName, Email: '', phoneNo: '' };
    this.isContactModalVisible = true;
  }
  closeQuickCreateContactModal() { this.isContactModalVisible = false; }
addNewContact(newContactData: QuickContactFormData) {
    // If FormModal's handleSubmit validated, we can proceed
    const payload = { firstName: newContactData.FirstName, lastName: newContactData.LastName || '', email: newContactData.Email, phoneNumber: newContactData.phoneNo, companyName: this.newDeal.companyName, createdBy: 1 };
    // ... rest of your existing logic ...
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

  openCustomizeFieldModal() { this.customizeFieldFormData = {}; this.isCustomizeFieldModalVisible = true; }
  closeCustomizeFieldModal() { this.isCustomizeFieldModalVisible = false; }
  addCustomField(newField: any) { console.log('Custom Field Added:', newField); this.closeCustomizeFieldModal(); }
}