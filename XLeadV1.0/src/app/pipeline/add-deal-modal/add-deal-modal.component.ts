import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { finalize } from 'rxjs/operators';
export interface QuickContactFormData {
  FirstName: string;
  LastName: string;
  Designation: string;
  companyName: string;
  Email: string;
  phoneNo: string;
  countryCode: string; // Added
}

// Interface for newDeal to define known properties and allow dynamic custom fields
interface NewDeal {
  amount: number;
  companyName: string;
  title: string;
  account: number | null;
  serviceline: number | null; 
  region: number | null;
  contactName: string;
  domain: number | null;
  stage: number | null;
  revenueType: number | null;
  department: number | null;
  country: number | null;
  startDate: Date | null;
  closeDate: Date | null;
  description: string;
  probability: number | null;
  [key: string]: any; // Allow dynamic properties for custom fields
}

import { CountryService } from 'src/app/services/country.service';
import { DuService } from 'src/app/services/du.service';
import { RevenuetypeService } from 'src/app/services/revenuetype.service';
import { AccountService } from '../../services/account.service';
import { RegionService } from '../../services/region.service';
import { DomainService } from '../../services/domain.service';
import { DealstageService } from 'src/app/services/dealstage.service';
import { Company, CompanyContactService, Contact } from 'src/app/services/company-contact.service';
import { DealService } from 'src/app/services/dealcreation.service';
import { DealCreatePayload, DealRead } from 'src/app/services/dealcreation.service';
import { DxValidationRule } from '../form-modal/form-modal.component';
import { SeviceLineService } from 'src/app/services/sevice-line.service';
import { IndustryVerticalService } from 'src/app/services/industry-vertical.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';


@Component({
  selector: 'app-add-deal-modal',
  templateUrl: './add-deal-modal.component.html',
  styleUrls: ['./add-deal-modal.component.css']
})
export class AddDealModalComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('dealFormInstance', { static: false }) dealFormInstance!: DxFormComponent;
  @ViewChild('popupInstanceRef', { static: false }) dxPopupInstance!: DxPopupComponent;
  @ViewChild('formContainer', { static: false }) formContainer!: ElementRef<HTMLDivElement>;

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
  industryVertical: { id: number; industryName: string }[] = [];
  accounts: { id: number; accountName: string }[
  ] = [];
   serviceline: { id: number; serviceName: string }[
  ] = [];
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

  customFields: { fieldLabel: string; fieldType: string; dataField: string; required?: boolean }[] = [];

 
  newDeal: NewDeal = {
    amount: 0,
    companyName: '',
    title: '',
    account: null,
    serviceline: null,
    region: null,
    contactName: '',
    domain: null,
    stage: null,
    revenueType: null,
    department: null,
    country: null,
    startDate: null,
    closeDate: null,
    description: '',
    probability: null,
  };

  isCompanyModalVisible: boolean = false;
   companyData = { 
    companyName: '', 
    phoneNo: '', 
    website: '', 
    industryVertical: null as number | null,
    countryCode: '+91' // Default country code
  };
  companyFields: {
    dataField: string;
    label: string;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[];
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
      dataField: 'industryVertical',
      label: 'Industry Vertical',
      editorType: 'dxSelectBox',
      editorOptions: {
        dataSource: [], 
        displayExpr: 'industryName',
        valueExpr: 'id',
        searchEnabled: true,
        placeholder: 'Select Industry Vertical'
      },
      validationRules: [
        { type: 'required', message: 'Industry Vertical is required' }
      ]
    },
    {
      dataField: 'countryCode',
      label: 'Country Code',
      editorType: 'dxSelectBox',
      editorOptions: {
        dataSource: [
          { code: '+91', name: 'India (+91)' },
          { code: '+1', name: 'United States (+1)' },
          { code: '+44', name: 'United Kingdom (+44)' },
          { code: '+81', name: 'Japan (+81)' },
          { code: '+86', name: 'China (+86)' },
          { code: '+33', name: 'France (+33)' },
          { code: '+49', name: 'Germany (+49)' },
          { code: '+39', name: 'Italy (+39)' },
          { code: '+34', name: 'Spain (+34)' },
          { code: '+7', name: 'Russia (+7)' },
          { code: '+55', name: 'Brazil (+55)' },
          { code: '+52', name: 'Mexico (+52)' },
          { code: '+61', name: 'Australia (+61)' },
          { code: '+82', name: 'South Korea (+82)' },
          { code: '+65', name: 'Singapore (+65)' }
        ],
        displayExpr: 'name',
        valueExpr: 'code',
        searchEnabled: true,
        placeholder: 'Select Country Code'
      },
      validationRules: [
        { type: 'required', message: 'Country Code is required' }
      ]
    },
    {
      dataField: 'phoneNo',
      label: 'Phone Number',
      editorType: 'dxTextBox',
      editorOptions: {
        mask: '00000-00000',
        maskRules: { "0": /[0-9]/ },
        placeholder: 'Enter 10-digit phone number'
      },
      validationRules: [
        { type: 'required', message: 'Phone Number is required' },
       
      ]
    },
    {
      dataField: 'website',
      label: 'Website',
      validationRules: [
        { type: 'required', message: 'Website is required' },
        { type: 'pattern', pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, message: 'Invalid website URL format' }
      ]
    }
  ];
  isContactModalVisible: boolean = false;
 contactData: QuickContactFormData = { 
  FirstName: '', 
  LastName: '', 
  Designation: '', 
  companyName: '', 
  Email: '', 
  phoneNo: '',
  countryCode: '+91' // Default to India
};
  contactFields: {
    dataField: string;
    label: string;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[];
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
     
      validationRules: [
         { type: 'stringLength', min: 2, message: 'Last Name must be at least 2 characters if provided' }
      ]
    },
    {
      dataField: 'Designation',
      label: 'Designation',
      validationRules: [
        { type: 'required', message: 'Designation is required' },
        { type: 'stringLength', min: 2, message: 'Designation must be at least 2 characters' }
      ]
    },
    {
      dataField: 'companyName',
      label: 'Company Name',
      editorOptions: { disabled: true },
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
    { type: 'required', message: 'Email is required' }, // Added required rule
    { type: 'email', message: 'Invalid email format' }
  ]
},
 {
      dataField: 'countryCode',
      label: 'Country Code',
      editorType: 'dxSelectBox',
      editorOptions: {
        dataSource: [
          { code: '+91', name: 'India (+91)' },
          { code: '+1', name: 'United States (+1)' },
          { code: '+44', name: 'United Kingdom (+44)' },
          { code: '+81', name: 'Japan (+81)' },
          { code: '+86', name: 'China (+86)' },
          { code: '+33', name: 'France (+33)' },
          { code: '+49', name: 'Germany (+49)' },
          { code: '+39', name: 'Italy (+39)' },
          { code: '+34', name: 'Spain (+34)' },
          { code: '+7', name: 'Russia (+7)' },
          { code: '+55', name: 'Brazil (+55)' },
          { code: '+52', name: 'Mexico (+52)' },
          { code: '+61', name: 'Australia (+61)' },
          { code: '+82', name: 'South Korea (+82)' },
          { code: '+65', name: 'Singapore (+65)' }
        ],
        displayExpr: 'name',
        valueExpr: 'code',
        searchEnabled: true,
        placeholder: 'Select Country Code'
      },
      validationRules: [
        { type: 'required', message: 'Country Code is required' }
      ]
    },
{
  dataField: 'phoneNo',
  label: 'Phone Number',
  editorType: 'dxTextBox',
  editorOptions: {
    mask: '00000-00000', // Remove hardcoded country code from mask
    maskRules: { "0": /[0-9]/ },
    placeholder: 'Enter 10-digit phone number'
  },
  validationRules: [
    { type: 'required', message: 'Phone Number is required' },
    {
      type: 'pattern',
      pattern: /^\d{5}-?\d{5}$/, // Adjust pattern to match 10 digits with optional hyphen
      message: 'Phone number must be 10 digits (e.g., 12345-67890 or 1234567890)'
    }
  ]
}
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
    private serviceLine:SeviceLineService,
    private industryVerticalService: IndustryVerticalService,
    private authService: AuthServiceService
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
  precision: 2  
};


  ngOnInit() {
    console.log('AddDealModal ngOnInit - dealFormInstance:', this.dealFormInstance);
    this.loadDropdownData();
    if (this.mode === 'edit' && this.dealToEdit) {
      this.prefillFormForEdit(this.dealToEdit);
    } else {
      this.resetForm();
    }
  }

  ngAfterViewInit() {
    console.log('AddDealModal ngAfterViewInit - dealFormInstance:', this.dealFormInstance);

    if (this.dxPopupInstance && this.dxPopupInstance.instance) {
      this.dxPopupInstance.instance.on('shown', () => {
        console.log('DxPopup "shown" event. Current dealFormInstance:', this.dealFormInstance);
        this.cdr.detectChanges();

        if (this.dealFormInstance && this.dealFormInstance.instance) {
          this.isFormReady = true;
         
        } else {
          console.error('CRITICAL: dealFormInstance is NOT available even after popup "shown" and detectChanges.');
          alert('Form failed to initialize. Please try again.');
        }
        this.cdr.detectChanges();
      });

      this.dxPopupInstance.instance.on('hiding', () => {
        this.isFormReady = false;
        console.log('Form is marked as not ready (popup hiding).');
        this.cdr.detectChanges();
      });
    } else {
      console.warn('dxPopupInstance is not available in ngAfterViewInit. Popup events cannot be subscribed.');
    }
  }

  onMouseWheel(event: WheelEvent) {
    if (this.formContainer && this.formContainer.nativeElement) {
      const container = this.formContainer.nativeElement;
      container.scrollTop += event.deltaY;
      event.preventDefault();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      if (this.isVisible) {
        this.isFormReady = false;
        console.log('Modal became visible (isVisible=true), form marked as NOT ready initially.');
        if (this.mode === 'edit' && this.dealToEdit) {
          this.prefillFormForEdit(this.dealToEdit);
        } else {
          this.resetForm();
        }
      } else {
        this.isFormReady = false;
        console.log('Modal became hidden (isVisible=false), form marked as NOT ready.');
      }
    }
    if (changes['dealToEdit'] && this.isVisible && this.mode === 'edit' && this.dealToEdit) {
      this.prefillFormForEdit(this.dealToEdit);
    }
  }

  loadDropdownData() {
    this.loadAccounts();
    this.loadServiceLines();
    this.loadRegions();
    this.loadDomains();
    this.loadStages();
    this.loadDus();
    this.loadRevenueTypes();
    this.loadCountries();
    this.loadCompanyContactData();
    this.loadIndustryVerticals();
  }
  loadIndustryVerticals() {
    this.industryVerticalService.getIndustryVertical().subscribe({
      next: (data) => {
        this.industryVertical = data;
        // Update the companyFields editorOptions for industryVertical
        const industryField = this.companyFields.find(field => field.dataField === 'industryVertical');
        if (industryField && industryField.editorOptions) {
          industryField.editorOptions.dataSource = this.industryVertical;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading industry verticals', err)
    });
  }

loadServiceLines() {
  this.serviceLine.getServiceTypes().subscribe(data => this.serviceline = data, err => console.error('Error accounts', err));
}
  loadAccounts() {
    this.accountService.getAllAccounts().subscribe(data => this.accounts = data, err => console.error('Error accounts', err));
  }

  loadRegions() {
    this.regionService.getAllRegions().subscribe(data => this.regions = data, err => console.error('Error regions', err));
  }

  loadDomains() {
    this.domainService.getAllDomains().subscribe(data => this.domains = data, err => console.error('Error domains', err));
  }

  loadStages() {
    this.dealStageService.getAllDealStages().subscribe(data => this.dealStages = data.map(s => ({...s, displayName: s.displayName || s.stageName!})), err => console.error('Error stages', err));
  }

  loadDus() {
    this.duService.getDU().subscribe(data => this.dus = data, err => console.error('Error DUs', err));
  }

  loadRevenueTypes() {
    this.revenuetypeService.getRevenueTypes().subscribe(data => this.revenueTypes = data, err => console.error('Error revenue types', err));
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(data => this.countries = data, err => console.error('Error countries', err));
  }

  loadCompanyContactData() {
    this.companyContactService.getCompanyContactMap().subscribe(data => {
      this.companyContactMap = data;
      this.companies = Object.keys(data);
      this.filteredCompanies = [...this.companies];
      if (this.newDeal.companyName) {
        this.filteredContacts = this.companyContactMap[this.newDeal.companyName] || [];
      }
      this.cdr.detectChanges();
    });
  }

  prefillFormForEdit(deal: DealRead) {
    const parseDate = (dateStr: string | null | undefined): Date | null => dateStr ? new Date(dateStr) : null;
    
    // Reset newDeal with standard fields
    this.newDeal = {
      amount: deal.dealAmount || 0,
      companyName: '',
      title: deal.dealName || '',
      account: deal.accountId || null,
      serviceline: deal.serviceId || null,
      region: deal.regionId || null,
      contactName: deal.contactName || '',
      domain: deal.domainId || null,
      stage: deal.dealStageId || null,
      revenueType: deal.revenueTypeId || null,
      department: deal.duId || null,
      country: deal.countryId || null,
      startDate: parseDate(deal.startingDate),
      closeDate: parseDate(deal.closingDate),
      description: deal.description || '',
      probability: deal.probability || null,
    };

    // Prefill custom fields if they exist
    if (deal.customFields) {
      Object.keys(deal.customFields).forEach(key => {
        this.newDeal[key] = deal.customFields![key];
      });
    }

    if (deal.contactName && this.companyContactMap) {
      for (const compName of Object.keys(this.companyContactMap)) {
        if (this.companyContactMap[compName].includes(deal.contactName)) {
          this.newDeal.companyName = compName;
          break;
        }
      }
    }
    this.onCompanyChange(this.newDeal.companyName, false);
    this.cdr.detectChanges();
  }

  get modalTitle(): string {
    return this.mode === 'edit' ? 'Edit Deal' : 'Create Deal';
  }

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
    const missing = [
      !this.newDeal.region ? "Region" : null,
      !this.newDeal.stage ? "Stage" : null,
      !this.newDeal.revenueType ? "Revenue Type" : null,
      !this.newDeal.department ? "DU" : null,
      !this.newDeal.country ? "Country" : null
    ].filter(Boolean).join(', ');
    alert(`Required fields missing: ${missing}`);
    this.isLoading = false;
    this.onSubmitError.emit(`Required fields missing: ${missing}`);
    return;
  }

  if (!this.newDeal.startDate || !this.newDeal.closeDate) {
    alert("Starting and Closing dates are required.");
    this.isLoading = false;
    this.onSubmitError.emit("Starting and Closing dates are required.");
    return;
  }

  if (!this.selectedContactDetails) {
    alert("Contact details could not be loaded. Please try selecting the contact again.");
    this.isLoading = false;
    this.onSubmitError.emit("Contact details not available.");
    return;
  }

  // Extract custom fields into an object
  const customFieldValues: { [key: string]: any } = {};
  this.customFields.forEach(field => {
    customFieldValues[field.dataField] = this.newDeal[field.dataField];
  });

  const dealPayload: DealCreatePayload = {
    title: this.newDeal.title,
    amount: this.newDeal.amount,
    companyName: this.newDeal.companyName,
    contactFullName: this.newDeal.contactName,
    contactEmail: this.selectedContactDetails.email,
    contactPhoneNumber: this.selectedContactDetails.phoneNo ? `${this.selectedContactDetails.countryCode || '+91'} ${this.selectedContactDetails.phoneNo}` : null,
    contactDesignation: this.selectedContactDetails.designation || null,
    accountId: this.newDeal.account,
    serviceId: this.newDeal.serviceline,
    regionId: this.newDeal.region as number,
    domainId: this.newDeal.domain,
    dealStageId: this.newDeal.stage as number,
    revenueTypeId: this.newDeal.revenueType as number,
    duId: this.newDeal.department as number,
    countryId: this.newDeal.country as number,
    description: this.newDeal.description,
    probability: this.newDeal.probability,
    startingDate: this.newDeal.startDate.toISOString(),
    closingDate: this.newDeal.closeDate.toISOString(),
    createdBy: this.authService.userId, // Hardcoded as 3
    customFields: customFieldValues
  };

  this.dealService.createDeal(dealPayload)
    .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
    .subscribe({
      next: (createdDeal: DealRead) => {
        alert('Deal created successfully!');
        this.onSubmitSuccess.emit(createdDeal);
        this.handleClose();
      },
      error: (err: Error) => {
        alert(`Error: ${err.message || 'Failed to create deal. Please try again.'}`);
        this.onSubmitError.emit(err.message || 'Failed to create deal. Please try again.');
      }
    });
}
  resetForm() {
    const resetData: NewDeal = {
      amount: 0,
      companyName: '',
      title: '',
      account: null,
      serviceline: null,
      region: null,
      contactName: '',
      domain: null,
      stage: null,
      revenueType: null,
      department: null,
      country: null,
      startDate: new Date(), // Set default to current date
      closeDate: null,
      description: '',
      probability: null,
    };

    // Reset custom field values
    this.customFields.forEach(field => {
      switch (field.fieldType.toLowerCase()) {
        case 'text':
          resetData[field.dataField] = '';
          break;
        case 'numerical':
          resetData[field.dataField] = null;
          break;
        case 'boolean':
          resetData[field.dataField] = false;
          break;
        case 'date':
          resetData[field.dataField] = null;
          break;
        default:
          resetData[field.dataField] = '';
      }
    });

    this.newDeal = resetData;

    if (this.companies && this.companies.length > 0) {
      this.filteredCompanies = [...this.companies];
    } else {
      this.filteredCompanies = [];
    }
    this.filteredContacts = [];
    this.isLoading = false;
    this.dealFormInstance?.instance.resetValues();
    this.cdr.detectChanges();
  }

  onCompanyChange(companyName: string, clearContact: boolean = true) {
    this.newDeal.companyName = companyName;
    this.filteredContacts = this.companyContactMap[companyName] || [];
    if (clearContact || !this.filteredContacts.includes(this.newDeal.contactName)) {
      this.newDeal.contactName = '';
    }
    this.cdr.detectChanges();
  }
selectedContactDetails: Contact | null = null;
 onContactChange(contactName: string) {
  this.newDeal.contactName = contactName;
  if (contactName && this.newDeal.companyName) {
    this.companyContactService.getContactByNameAndCompany(contactName, this.newDeal.companyName)
      .subscribe({
        next: (contact) => {
          this.selectedContactDetails = contact || null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching contact details:', err);
          this.selectedContactDetails = null;
        }
      });
  } else {
    this.selectedContactDetails = null;
  }
}

 openQuickCreateCompanyModal() {
    this.companyData = { 
      companyName: '', 
      phoneNo: '', 
      website: '', 
      industryVertical: null,
      countryCode: '+91' // Default to India
    };
    this.isCompanyModalVisible = true;
  }

  closeQuickCreateCompanyModal() {
    this.isCompanyModalVisible = false;
  }

   addNewCompany(newCompanyData: { 
  companyName: string; 
  phoneNo: string; 
  website: string; 
  industryVertical: number | null;
  countryCode: string;
}) {
  // Combine country code with phone number
  const fullPhoneNumber = `${newCompanyData.countryCode} ${newCompanyData.phoneNo}`;

  const payload: Company = { 
    companyName: newCompanyData.companyName,
    phoneNo: newCompanyData.phoneNo, // Not needed in payload since we use fullPhoneNumber
    website: newCompanyData.website,
    industryVerticalId: newCompanyData.industryVertical,
    countryCode: newCompanyData.countryCode,
    createdBy: this.authService.userId // Hardcoded as 3
  };

  // Map to backend DTO (CustomerCreateDto)
  const backendPayload = {
    customerName: payload.companyName,
    website: payload.website || null,
    customerPhoneNumber: fullPhoneNumber,
    industryVerticalId: payload.industryVerticalId || null,
    createdBy: payload.createdBy
  };

  this.isLoading = true;
  this.companyContactService.addCompany(backendPayload).pipe(
    finalize(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    })
  ).subscribe({
    next: () => {
      alert('Company added successfully!');
      this.loadCompanyContactData(); // Refresh the company-contact map
      this.newDeal.companyName = payload.companyName;
      this.onCompanyChange(payload.companyName);
      this.closeQuickCreateCompanyModal();
    },
    error: (err) => {
      console.error('Company creation failed:', err);
      alert(err.message || 'Failed to create company.');
    }
  });
}
  openQuickCreateContactModal() {
  if (!this.newDeal.companyName) {
    alert('Please select a company first.');
    return;
  }
  this.contactData = { 
    FirstName: '', 
    LastName: '', 
    Designation: '', 
    companyName: this.newDeal.companyName, 
    Email: '', 
    phoneNo: '',
    countryCode: '+91'
  };
  this.isContactModalVisible = true;
  this.cdr.detectChanges(); // Ensure form updates
}
closeQuickCreateContactModal() {
  this.isContactModalVisible = false;
  this.contactData = { 
    FirstName: '', 
    LastName: '', 
    Designation: '', 
    companyName: '', 
    Email: '', 
    phoneNo: '',
    countryCode: '+91'
  };
}

 addNewContact(newContactData: QuickContactFormData) {
  // Combine country code with phone number
  const fullPhoneNumber = `${newContactData.countryCode} ${newContactData.phoneNo}`;

  const payload: Contact = { 
    firstName: newContactData.FirstName,
    lastName: newContactData.LastName || '',
    designation: newContactData.Designation,
    email: newContactData.Email,
    phoneNo: newContactData.phoneNo,
    companyName: this.newDeal.companyName,
    countryCode: newContactData.countryCode,
    createdBy: this.authService.userId // Hardcoded as 3
  };

  // Map to backend DTO (ContactCreateDto)
  const backendPayload = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    designation: payload.designation,
    email: payload.email,
    phoneNumber: fullPhoneNumber,
    customerName: payload.companyName,
    createdBy: payload.createdBy
  };

  this.isLoading = true;
  this.companyContactService.addContact(backendPayload).pipe(
    finalize(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    })
  ).subscribe({
    next: () => {
      alert('Contact added successfully!');
      this.loadCompanyContactData();
      const fullName = `${payload.firstName} ${payload.lastName}`.trim();
      setTimeout(() => {
        this.newDeal.contactName = fullName;
        this.onCompanyChange(this.newDeal.companyName, false);
        this.cdr.detectChanges();
      }, 300);
      this.closeQuickCreateContactModal();
    },
    error: (err) => {
      console.error('Contact creation failed:', err);
      alert(err.message || 'Failed to create contact.');
    }
  });
}
  openCustomizeFieldModal() {
    this.customizeFieldFormData = {};
    this.isCustomizeFieldModalVisible = true;
  }

  closeCustomizeFieldModal() {
    this.isCustomizeFieldModalVisible = false;
  }

  addCustomField(newField: any) {
    console.log('Custom Field Added:', newField);

    // Generate a unique dataField name (e.g., "custom_fieldLabel")
    const dataField = `custom_${newField.fieldLabel.toLowerCase().replace(/\s+/g, '_')}`;

    // Add the new field to customFields
    this.customFields.push({
      fieldLabel: newField.fieldLabel,
      fieldType: newField.fieldType,
      dataField: dataField,
      required: false,
    });

    console.log("Custom field array", this.customFields);

    // Initialize the value in newDeal based on fieldType
    switch (newField.fieldType.toLowerCase()) {
      case 'text':
        this.newDeal[dataField] = '';
        break;
      case 'numerical':
        this.newDeal[dataField] = null;
        break;
      case 'boolean':
        this.newDeal[dataField] = false;
        break;
      case 'date':
        this.newDeal[dataField] = null;
        break;
      default:
        this.newDeal[dataField] = '';
    }
    
    this.cdr.detectChanges();
    console.log("Custom field array", this.customFields);
    this.closeCustomizeFieldModal();
  }

  // Map field type to DevExtreme editor type
  getEditorType(fieldType: string): string {
    switch (fieldType.toLowerCase()) {
      case 'text':
        return 'dxTextBox';
      case 'numerical':
        return 'dxNumberBox';
      case 'boolean':
        return 'dxCheckBox';
      case 'date':
        return 'dxDateBox';
      default:
        return 'dxTextBox';
    }
  }

  // Provide editor options based on field type
  getEditorOptions(fieldType: string): any {
    switch (fieldType.toLowerCase()) {
      case 'text':
        return { placeholder: `Enter ${fieldType}` };
      case 'numerical':
        return { showSpinButtons: true };
      case 'boolean':
        return {};
      case 'date':
        return { displayFormat: 'dd/MMM/yyyy' };
      default:
        return {};
    }
  }

 

}