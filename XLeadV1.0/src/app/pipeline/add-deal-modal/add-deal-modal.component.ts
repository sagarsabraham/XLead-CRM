import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { finalize } from 'rxjs/operators';
import { getSupportedInputTypes } from '@angular/cdk/platform';

export interface QuickContactFormData {
  FirstName: string;
  LastName: string;
  Designation: string; 
  companyName: string;
  Email: string;
  phoneNo: string;
}

interface NewDeal {
  amount: number;
  companyName: string;
  title: string;
  account: number | null;
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
  [key: string]: any; 
}

import { CountryService } from 'src/app/services/country.service';
import { DuService } from 'src/app/services/du.service';
import { RevenuetypeService } from 'src/app/services/revenuetype.service';
import { AccountService } from '../../services/account.service';
import { RegionService } from '../../services/region.service';
import { DomainService } from '../../services/domain.service';
import { DealstageService } from 'src/app/services/dealstage.service';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import { DealService } from 'src/app/services/dealcreation.service';
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
  @ViewChild('formContainer', { static: false }) formContainer!: ElementRef<HTMLDivElement>;

  @Input() isVisible: boolean = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() dealToEdit: DealRead | null = null;
  @Input() selectedStage: number | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmitSuccess = new EventEmitter<DealRead>();
  @Output() onSubmitError = new EventEmitter<string>();

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

  customFields: { fieldLabel: string; fieldType: string; dataField: string; required?: boolean }[] = [];

  newDeal: NewDeal = {
    amount: 0,
    companyName: '',
    title: '',
    account: null,
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
  companyData = { companyName: '', phoneNo: '', website: '' };
  companyFields: {
    dataField: string;
    label: string;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[];
  }[] = [
    {
      dataField: 'companyName',
      label: 'Customer Name',
      validationRules: [
        { type: 'required', message: 'Customer Name is required' },
        { type: 'stringLength', min: 2, message: 'Customer Name must be at least 2 characters long' }
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
  contactData: QuickContactFormData = { FirstName: '', LastName: '', Designation: '', companyName: '', Email: '', phoneNo: '' };
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
      dataField: 'designation',
      label: 'Designation',
      validationRules: [
        { type: 'required', message: 'Designation is required' },
        { type: 'stringLength', min: 2, message: 'Designation must be at least 2 characters' }
      ]
    },
    {
      dataField: 'companyName',
      label: 'Customer Name',
      editorOptions: { disabled: true },
      validationRules: [
        { type: 'required', message: 'Customer Name is required (should be auto-filled)' }
      ]
    },
    {
      dataField: 'Email',
      label: 'Email',
      editorType: 'dxTextBox',
      editorOptions: { mode: 'email' },
      validationRules: [
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
  ]
},
  ];

  isCustomizeFieldModalVisible: boolean = false;
  customizeFieldFormData: any = {};
  customizeFieldModalFields = [
    { dataField: 'fieldLabel', label: 'Field Label', required: true },
    { dataField: 'fieldType', label: 'Field Type', editorType: 'dxSelectBox', editorOptions: { items: ['Text', 'Numerical', 'Boolean', 'Date'], placeholder: 'Select field type' }, required: true }
  ];

  private qualificationStageId: number | null = null; 

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
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.popupWidth = event.target.innerWidth < 600 ? '90%' : 500;
  }

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
          console.log('Form is now marked as ready.');
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
    this.loadRegions();
    this.loadDomains();
    this.loadStages();
    this.loadDus();
    this.loadRevenueTypes();
    this.loadCountries();
    this.loadCompanyContactData();
  }

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe(
    data => {
      this.accounts = data;
      this.cdr.detectChanges(); // <-- Move here
    },
    err => console.error('Error accounts', err)
  );
  }

  loadRegions() {
    this.regionService.getAllRegions().subscribe(
    data => {
      this.regions = data;
      this.cdr.detectChanges();
    },
    err => console.error('Error regions', err)
  );
  }

  loadDomains() {
    this.domainService.getAllDomains().subscribe(
    data => {
      this.domains = data;
      this.cdr.detectChanges();
    },
    err => console.error('Error domains', err)
  );
  }

  loadStages() {
    this.dealStageService.getAllDealStages().subscribe({
      next: (data) => {
        this.dealStages = data.map(s => ({ ...s, displayName: s.displayName || s.stageName! }));
        // Find the "Qualification" stage ID for fallback
        const qualificationStage = this.dealStages.find(stage => stage.displayName === 'Qualification' || stage.stageName === 'Qualification');
        if (qualificationStage) {
          this.qualificationStageId = qualificationStage.id;
          console.log('Qualification stage ID found:', this.qualificationStageId);
        } else {
          console.warn('Qualification stage not found in dealStages:', this.dealStages);
        }
        // Set the stage based on selectedStage or fallback to Qualification
        if (this.mode !== 'edit' || !this.dealToEdit) {
          this.setDefaultStage();
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error stages', err)
    });
  }

  loadDus() {
    this.duService.getDU().subscribe(
    data => {
      this.dus = data;
      this.cdr.detectChanges();
    },
    err => console.error('Error DUs', err)
  );
  }

  loadRevenueTypes() {
    this.revenuetypeService.getRevenueTypes().subscribe(
    data => {
      this.revenueTypes = data;
      this.cdr.detectChanges();
    },
    err => console.error('Error revenue types', err)
  );
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(
    data => {
      this.countries = data;
      this.cdr.detectChanges();
    },
    err => console.error('Error countries', err)
  );
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
    }, err => console.error('Error company/contact map', err));
  }

  prefillFormForEdit(deal: DealRead) {
    const parseDate = (dateStr: string | null | undefined): Date | null => dateStr ? new Date(dateStr) : null;
    
    // Reset newDeal with standard fields
    this.newDeal = {
      amount: deal.dealAmount || 0,
      companyName: '',
      title: deal.dealName || '',
      account: deal.accountId || null,
      region: deal.regionId || null,
      contactName: deal.contactName || '',
      domain: deal.domainId || null,
      stage: deal.dealStageId || this.qualificationStageId,
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
    console.log('handleSubmit CALLED - isFormReady:', this.isFormReady, 'dealFormInstance:', this.dealFormInstance);
    if (!this.isFormReady || !this.dealFormInstance || !this.dealFormInstance.instance) {
      let message = "The form is not ready for submission. ";
      if (!this.isFormReady) message += "Popup content might not be fully initialized. ";
      if (!this.dealFormInstance || !this.dealFormInstance.instance) message += "Form component reference is missing. ";
      
      console.error(message + "Please wait a moment. If the problem persists, try closing and reopening the modal.");
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
      accountId: this.newDeal.account,
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
      createdBy: 1,
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
          console.error('Error creating deal:', err.message, err);
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
      region: null,
      contactName: '',
      domain: null,
      stage: null,
      revenueType: null,
      department: null,
      country: null,
      startDate: new Date(), 
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

    this.setDefaultStage();

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

  private setDefaultStage() {
    // Use selectedStage if provided, otherwise fall back to Qualification
    if (this.selectedStage !== null && this.dealStages.some(stage => stage.id === this.selectedStage)) {
      this.newDeal.stage = this.selectedStage;
    } else if (this.qualificationStageId !== null) {
      this.newDeal.stage = this.qualificationStageId;
    }
  }

  onCompanyChange(companyName: string, clearContact: boolean = true) {
    this.newDeal.companyName = companyName;
    this.filteredContacts = this.companyContactMap[companyName] || [];
    if (clearContact || !this.filteredContacts.includes(this.newDeal.contactName)) {
      this.newDeal.contactName = '';
    }
    this.cdr.detectChanges();
  }

  onContactChange(contactName: string) {
    this.newDeal.contactName = contactName;
  }

  openQuickCreateCompanyModal() {
    this.companyData = { companyName: '', phoneNo: '', website: '' };
    this.isCompanyModalVisible = true;
  }

  closeQuickCreateCompanyModal() {
    this.isCompanyModalVisible = false;
  }

  addNewCompany(newCompanyData: { companyName: string; phoneNo: string; website: string; }) {
    const payload = { companyName: newCompanyData.companyName, website: newCompanyData.website, companyPhoneNumber: newCompanyData.phoneNo, createdBy: 1 };
    this.isLoading = true;
    this.companyContactService.addCompany(payload).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        alert('Company added!');
        this.loadCompanyContactData();
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
    this.contactData = { FirstName: '', LastName: '', Designation: '', companyName: this.newDeal.companyName, Email: '', phoneNo: '' };
    this.isContactModalVisible = true;
  }

  closeQuickCreateContactModal() {
    this.isContactModalVisible = false;
  }

  addNewContact(newContactData: QuickContactFormData) {
    const payload = { firstName: newContactData.FirstName, lastName: newContactData.LastName || '', 
      designation: newContactData.Designation, // Include designation in payload
      email: newContactData.Email, phoneNumber: newContactData.phoneNo, companyName: this.newDeal.companyName, createdBy: 1 };
    this.isLoading = true;
    this.companyContactService.addContact(payload).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        alert('Contact added!');
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

  showForm = true;
  addCustomField(newField: any) {
    console.log('Custom Field Added:', newField);

    const dataField = `custom_${newField.fieldLabel.toLowerCase().replace(/\s+/g, '_')}`;

    // Add the new field to customFields
    this.customFields.push({
      fieldLabel: newField.fieldLabel,
      fieldType: newField.fieldType,
      dataField: dataField,
      required: false,
    });

    this.newDeal[dataField] = '';

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
    
    this.showForm = false;
    this.cdr.detectChanges();
    this.showForm = true;
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

  validateCloseDate = (e: any) => {
  return !this.newDeal.startDate || !e.value || new Date(e.value) >= new Date(this.newDeal.startDate);
  }

  currencyFormat = {
  type: 'fixedPoint',
  precision: 2  
  };
}