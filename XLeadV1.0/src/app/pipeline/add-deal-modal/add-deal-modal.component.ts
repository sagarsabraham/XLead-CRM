import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
 
import { CountryService } from 'src/app/services/country.service';
import { DuService } from 'src/app/services/du.service';
import { RevenuetypeService } from 'src/app/services/revenuetype.service';
import { AccountService } from '../../services/account.service';
import { RegionService } from '../../services/region.service';
import { DomainService } from '../../services/domain.service';
import { DealstageService } from 'src/app/services/dealstage.service';
import { Customer, CompanyContactService, Contact, CustomerContactMap } from 'src/app/services/company-contact.service';
import { DealService, DealCreatePayload, DealRead, DealEditPayload } from 'src/app/services/dealcreation.service';
import { DxValidationRule } from '../form-modal/form-modal.component';
import { SeviceLineService } from 'src/app/services/sevice-line.service';
import { IndustryVerticalService } from 'src/app/services/industry-vertical.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CountryCodeService } from 'src/app/services/country-code.service';
 
export interface QuickContactFormData {
  FirstName: string;
  LastName: string;
  Designation: string;
  customerName: string;
  Email: string;
  phoneNo: string;
  countryCode: string;
}
 
interface NewDeal {
  amount: number;
  customerName: string;
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
  [key: string]: any;
}
 
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
  isContactLoading: boolean = false;
  isDropdownDataLoaded: boolean = false;
 
  industryVertical: { id: number; industryName: string }[] = [];
  accounts: { id: number; accountName: string }[] = [];
  serviceline: { id: number; serviceName: string }[] = [];
  regions: { id: number; regionName: string }[] = [];
  domains: { id: number; domainName: string }[] = [];
  dealStages: { id: number; displayName: string; stageName?: string }[] = [];
  revenueTypes: { id: number; revenueTypeName: string }[] = [];
  dus: { id: number; duName: string }[] = [];
  countries: { id: number; countryName: string }[] = [];
  countryCodes: { code: string; name: string }[] = [];
 
  customerContactMap: { [customerName: string]: CustomerContactMap} = {};
  customerDataSource: { name: string; disabled: boolean }[] = [];
  filteredContacts: string[] = [];
 
  customFields: { fieldLabel: string; fieldType: string; dataField: string; required?: boolean }[] = [];
 
  newDeal: NewDeal = {
    amount: 0,
    customerName: '',
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
 
  isCustomerModalVisible: boolean = false;
  customerData = {
    customerName: '',
    phoneNo: '',
    website: '',
    industryVertical: null as number | null,
    countryCode: '+91'
  };
 
  customerFields: {
    dataField: string;
    label: string;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[];
  }[] = [
      { dataField: 'customerName', label: 'Customer Name', validationRules: [{ type: 'required', message: 'Customer Name is required' }, { type: 'stringLength', min: 2, message: 'Customer Name must be at least 2 characters long' }] },
      { dataField: 'industryVertical', label: 'Industry Vertical', editorType: 'dxSelectBox', editorOptions: { dataSource: [], displayExpr: 'industryName', valueExpr: 'id', searchEnabled: true, placeholder: 'Select Industry Vertical' }, validationRules: [{ type: 'required', message: 'Industry Vertical is required' }] },
      { dataField: 'countryCode', label: 'Country Code', editorType: 'dxSelectBox', editorOptions: { dataSource: this.countryCodes, displayExpr: 'name', valueExpr: 'code', searchEnabled: true, placeholder: 'Select Country Code' }, validationRules: [{ type: 'required', message: 'Country Code is required' }] },
      { dataField: 'phoneNo', label: 'Phone Number', editorType: 'dxTextBox', editorOptions: { mask: '00000-00000', maskRules: { "0": /[0-9]/ }, placeholder: 'Enter 10-digit phone number' }, validationRules: [{ type: 'required', message: 'Phone Number is required' }] },
      { dataField: 'website', label: 'Website', validationRules: [{ type: 'required', message: 'Website is required' }, { type: 'pattern', pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, message: 'Invalid website URL format' }] }
    ];
 
  isContactModalVisible: boolean = false;
  contactData: QuickContactFormData = {
    FirstName: '',
    LastName: '',
    Designation: '',
    customerName: '',
    Email: '',
    phoneNo: '',
    countryCode: '+91'
  };
 
  contactFields: {
    dataField: string;
    label: string;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[];
  }[] = [
      { dataField: 'FirstName', label: 'First Name', validationRules: [{ type: 'required', message: 'First Name is required' }, { type: 'stringLength', min: 2, message: 'First Name must be at least 2 characters' }] },
      { dataField: 'LastName', label: 'Last Name', validationRules: [{ type: 'stringLength', min: 2, message: 'Last Name must be at least 2 characters if provided' }] },
      { dataField: 'Designation', label: 'Designation', validationRules: [{ type: 'required', message: 'Designation is required' }, { type: 'stringLength', min: 2, message: 'Designation must be at least 2 characters' }] },
      { dataField: 'customerName', label: 'Customer Name', editorOptions: { disabled: true }, validationRules: [{ type: 'required', message: 'Customer Name is required (should be auto-filled)' }] },
      { dataField: 'Email', label: 'Email', editorType: 'dxTextBox', editorOptions: { mode: 'email' }, validationRules: [{ type: 'required', message: 'Email is required' }, { type: 'email', message: 'Invalid email format' }] },
      { dataField: 'countryCode', label: 'Country Code', editorType: 'dxSelectBox', editorOptions: { dataSource: this.countryCodes, displayExpr: 'name', valueExpr: 'code', searchEnabled: true, placeholder: 'Select Country Code' }, validationRules: [{ type: 'required', message: 'Country Code is required' }] },
      { dataField: 'phoneNo', label: 'Phone Number', editorType: 'dxTextBox', editorOptions: { mask: '00000-00000', maskRules: { "0": /[0-9]/ }, placeholder: 'Enter 10-digit phone number' }, validationRules: [{ type: 'required', message: 'Phone Number is required' }, { type: 'pattern', pattern: /^\d{5}-?\d{5}$/, message: 'Phone number must be 10 digits (e.g., 12345-67890 or 1234567890)' }] }
    ];
 
  isCustomizeFieldModalVisible: boolean = false;
  customizeFieldFormData: any = {};
  customizeFieldModalFields = [
    { dataField: 'fieldLabel', label: 'Field Label', required: true },
    { dataField: 'fieldType', label: 'Field Type', editorType: 'dxSelectBox', editorOptions: { items: ['Text', 'Numerical', 'Boolean', 'Date'], placeholder: 'Select field type' }, required: true }
  ];
 
  private qualificationStageId: number | null = null;
  selectedContactDetails: Contact | null = null;
 
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
    private serviceLine: SeviceLineService,
    private industryVerticalService: IndustryVerticalService,
    private authService: AuthServiceService,
    private countrycodeService: CountryCodeService
  ) { }
 
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
    this.loadAllData();
  }
 
  ngAfterViewInit() {
    console.log('AddDealModal ngAfterViewInit - dealFormInstance:', this.dealFormInstance);
 
    if (this.dxPopupInstance && this.dxPopupInstance.instance) {
      this.dxPopupInstance.instance.on('shown', () => {
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
        if (this.mode === 'edit' && this.dealToEdit) {
          if (this.isDropdownDataLoaded) {
            this.prefillFormForEdit(this.dealToEdit);
          }
        } else {
          if (this.isDropdownDataLoaded) {
            this.resetForm();
          } else {
            this.loadAllData();
          }
        }
      } else {
        this.isFormReady = false;
      }
    }
    if (changes['dealToEdit'] && this.isVisible && this.mode === 'edit' && this.dealToEdit) {
      if (this.isDropdownDataLoaded) {
        this.prefillFormForEdit(this.dealToEdit);
      }
    }
  }
 
  loadAllData() {
    this.isDropdownDataLoaded = false;
    forkJoin({
      accounts: this.accountService.getAllAccounts(),
      serviceLines: this.serviceLine.getServiceTypes(),
      regions: this.regionService.getAllRegions(),
      domains: this.domainService.getAllDomains(),
      stages: this.dealStageService.getAllDealStages(),
      dus: this.duService.getDU(),
      revenueTypes: this.revenuetypeService.getRevenueTypes(),
      countries: this.countryService.getCountries(),
      countryCodes: this.countrycodeService.getCountryCodes(),
      customerContactMap: this.companyContactService.getCompanyContactMap(),
      industryVerticals: this.industryVerticalService.getIndustryVertical(),
    }).subscribe({
      next: (results) => {
        this.accounts = results.accounts;
        this.serviceline = results.serviceLines;
        this.regions = results.regions;
        this.domains = results.domains;
        this.dealStages = results.stages.map(s => ({ ...s, displayName: s.displayName || s.stageName! }));
        const qualificationStage = this.dealStages.find(stage => stage.displayName === 'Qualification' || stage.stageName === 'Qualification');
        if (qualificationStage) {
          this.qualificationStageId = qualificationStage.id;
        }
        this.dus = results.dus;
        this.revenueTypes = results.revenueTypes;
        this.countries = results.countries;
        this.countryCodes = results.countryCodes.map((country: any) => ({
          code: country.idd.root + (country.idd.suffixes.length > 0 ? country.idd.suffixes[0] : ''),
          name: `${country.name.common} (${country.idd.root}${country.idd.suffixes.length > 0 ? country.idd.suffixes[0] : ''})`
        }));
 
        const customerCountryField = this.customerFields.find(f => f.dataField === 'countryCode');
        if (customerCountryField?.editorOptions) customerCountryField.editorOptions.dataSource = this.countryCodes;
        const contactCountryField = this.contactFields.find(f => f.dataField === 'countryCode');
        if (contactCountryField?.editorOptions) contactCountryField.editorOptions.dataSource = this.countryCodes;
 
        this.industryVertical = results.industryVerticals;
        const industryField = this.customerFields.find(field => field.dataField === 'industryVertical');
        if (industryField?.editorOptions) industryField.editorOptions.dataSource = this.industryVertical;
 
        // Process customer data
        this.customerContactMap = results.customerContactMap;
        this.customerDataSource = Object.keys(this.customerContactMap)
          .map(customerName => ({ name: customerName, info: this.customerContactMap[customerName] }))
          .filter(customer => customer.info.isHidden !== true)
          .map(customer => ({
            name: customer.name,
            disabled: !customer.info.isActive
          }));
 
        this.isDropdownDataLoaded = true;
 
        if (this.mode === 'edit' && this.dealToEdit && this.isVisible) {
          this.prefillFormForEdit(this.dealToEdit);
        } else if (this.mode === 'add') {
          this.resetForm();
        }
 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dropdown data:', err);
        this.isDropdownDataLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }
 
  prefillFormForEdit(deal: DealRead) {
    const parseDate = (dateStr: string | null | undefined): Date | null => dateStr ? new Date(dateStr) : null;
 
    this.newDeal = {
      amount: deal.dealAmount || 0,
      customerName: '',
      title: deal.dealName || '',
      account: deal.accountId || null,
      serviceline: deal.serviceId || null,
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
 
    if (deal.customFields) {
      Object.keys(deal.customFields).forEach(key => {
        this.newDeal[key] = deal.customFields![key];
        if (!this.customFields.some(field => field.dataField === key)) {
          const fieldLabel = key.replace('custom_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const fieldType = typeof deal.customFields![key] === 'number' ? 'Numerical' :
            typeof deal.customFields![key] === 'boolean' ? 'Boolean' :
              typeof deal.customFields![key] === 'string' && parseDate(deal.customFields![key]) ? 'Date' : 'Text';
          this.customFields.push({
            fieldLabel: fieldLabel,
            fieldType: fieldType,
            dataField: key,
            required: false,
          });
        }
      });
    }
 
    if (this.dealFormInstance?.instance) {
      this.dealFormInstance.instance.option('formData', this.newDeal);
    }
 
    if (deal.contactName && this.customerContactMap) {
      for (const custName of Object.keys(this.customerContactMap)) {
        const customerInfo = this.customerContactMap[custName];
        if (customerInfo && customerInfo.contacts.includes(deal.contactName)) {
          this.newDeal.customerName = custName;
          break;
        }
      }
    }
    this.onCustomerChange(this.newDeal.customerName, false);
 
    if (deal.serviceId && this.dealFormInstance?.instance) {
      this.dealFormInstance.instance.updateData('serviceline', deal.serviceId);
    }
 
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
    if (!this.isFormReady || !this.dealFormInstance?.instance) {
      alert("The form is not ready for submission. Please wait a moment.");
      return;
    }
 
    const validationResult = this.dealFormInstance.instance.validate();
    if (!validationResult.isValid) {
      alert('Please correct the validation errors before saving.');
      return;
    }
    if (this.isContactLoading) {
      alert("Contact details are still loading. Please wait a moment.");
      return;
    }
    this.isLoading = true;
 
    // Validation checks
    if (!this.newDeal.customerName || !this.newDeal.contactName || !this.newDeal.region || !this.newDeal.stage || !this.newDeal.revenueType || !this.newDeal.department || !this.newDeal.country || !this.newDeal.startDate || !this.newDeal.closeDate) {
      alert("Please fill all required fields.");
      this.isLoading = false;
      return;
    }
   
    const contactDetails = this.selectedContactDetails || { email: '', phoneNo: '', designation: '', countryCode: '+91' };
    const customFieldValues: { [key: string]: any } = {};
    this.customFields.forEach(field => {
      customFieldValues[field.dataField] = this.newDeal[field.dataField];
    });
 
    if (this.mode === 'edit' && this.dealToEdit) {
      const dealPayload: DealEditPayload = {
        title: this.newDeal.title,
        amount: this.newDeal.amount,
        customerName: this.newDeal.customerName,
        contactFullName: this.newDeal.contactName,
        contactEmail: contactDetails.email || null,
        contactPhoneNumber: contactDetails.phoneNo ? `${contactDetails.countryCode || '+91'} ${contactDetails.phoneNo}` : null,
        contactDesignation: contactDetails.designation || null,
        serviceId: this.newDeal.serviceline,
        accountId: this.newDeal.account,
        regionId: this.newDeal.region as number,
        domainId: this.newDeal.domain,
        dealStageId: this.newDeal.stage as number,
        revenueTypeId: this.newDeal.revenueType as number,
        duId: this.newDeal.department as number,
        countryId: this.newDeal.country as number,
        description: this.newDeal.description || null,
        probability: this.newDeal.probability,
        startingDate: this.newDeal.startDate ? this.newDeal.startDate.toISOString() : null,
        closingDate: this.newDeal.closeDate ? this.newDeal.closeDate.toISOString() : null,
      };
 
      this.dealService.updateDeal(this.dealToEdit.id, dealPayload)
        .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
        .subscribe({
          next: (updatedDeal) => {
            alert('Deal updated successfully!');
            this.onSubmitSuccess.emit(updatedDeal);
            this.handleClose();
          },
          error: (err) => {
            console.error('Error updating deal:', err);
            alert(`Error: ${err.message || 'Failed to update deal.'}`);
            this.onSubmitError.emit(err.message || 'Failed to update deal.');
          }
        });
    } else {
      const dealPayload: DealCreatePayload = {
        title: this.newDeal.title,
        amount: this.newDeal.amount,
        customerName: this.newDeal.customerName,
        contactFullName: this.newDeal.contactName,
        contactEmail: contactDetails.email || null,
        contactPhoneNumber: contactDetails.phoneNo ? `${contactDetails.countryCode || '+91'} ${contactDetails.phoneNo}` : null,
        contactDesignation: contactDetails.designation || null,
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
        createdBy: this.authService.userId,
        customFields: customFieldValues
      };
 
      this.dealService.createDeal(dealPayload)
        .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
        .subscribe({
          next: (createdDeal) => {
            alert('Deal created successfully!');
            this.onSubmitSuccess.emit(createdDeal);
            this.handleClose();
          },
          error: (err) => {
            console.error('Error creating deal:', err);
            alert(`Error: ${err.message || 'Failed to create deal.'}`);
            this.onSubmitError.emit(err.message || 'Failed to create deal.');
          }
        });
    }
  }
 
  resetForm() {
    const resetData: NewDeal = {
      amount: 0,
      customerName: '',
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
      startDate: new Date(),
      closeDate: null,
      description: '',
      probability: null,
    };
 
    this.customFields.forEach(field => {
      resetData[field.dataField] = field.fieldType.toLowerCase() === 'boolean' ? false : (field.fieldType.toLowerCase() === 'numerical' || field.fieldType.toLowerCase() === 'date' ? null : '');
    });
 
    this.newDeal = resetData;
    this.selectedContactDetails = null;
    this.isContactLoading = false;
    this.setDefaultStage();
 
    this.filteredContacts = [];
    this.isLoading = false;
    this.dealFormInstance?.instance.resetValues();
    this.cdr.detectChanges();
  }
 
  private setDefaultStage() {
    if (this.selectedStage !== null && this.dealStages.some(stage => stage.id === this.selectedStage)) {
      this.newDeal.stage = this.selectedStage;
    } else if (this.qualificationStageId !== null) {
      this.newDeal.stage = this.qualificationStageId;
    }
  }
 
  onCustomerChange(customerName: string, clearContact: boolean = true) {
    this.newDeal.customerName = customerName;
    const customerInfo = this.customerContactMap[customerName];
    this.filteredContacts = customerInfo ? customerInfo.contacts : [];
    if (clearContact || !this.filteredContacts.includes(this.newDeal.contactName)) {
      this.newDeal.contactName = '';
      this.selectedContactDetails = null;
    }
    this.dealFormInstance?.instance.updateData('customerName', this.newDeal.customerName);
    this.cdr.detectChanges();
  }
 
  onContactChange(contactName: string) {
    this.newDeal.contactName = contactName;
    if (contactName && this.newDeal.customerName) {
      this.isContactLoading = true;
      this.companyContactService.getContactByNameAndCustomer(contactName, this.newDeal.customerName)
        .pipe(finalize(() => { this.isContactLoading = false; this.cdr.detectChanges(); }))
        .subscribe({
          next: (contact) => {
            this.selectedContactDetails = contact || null;
            this.dealFormInstance?.instance.updateData('contactName', this.newDeal.contactName);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching contact details:', err);
            this.selectedContactDetails = null;
          }
        });
    } else {
      this.selectedContactDetails = null;
      this.isContactLoading = false;
    }
  }
 
  openQuickCreateCustomerModal() {
    this.customerData = { customerName: '', phoneNo: '', website: '', industryVertical: null, countryCode: '+91' };
    this.isCustomerModalVisible = true;
  }
 
  closeQuickCreateCustomerModal() {
    this.isCustomerModalVisible = false;
  }
 
  addNewCustomer(newCustomerData: { customerName: string; phoneNo: string; website: string; industryVertical: number | null; countryCode: string; }) {
    const fullPhoneNumber = `${newCustomerData.countryCode} ${newCustomerData.phoneNo}`;
    const payload: Customer = {
      customerName: newCustomerData.customerName,
      phoneNo: newCustomerData.phoneNo,
      website: newCustomerData.website,
      industryVerticalId: newCustomerData.industryVertical,
      countryCode: newCustomerData.countryCode,
      createdBy: this.authService.userId
    };
    const backendPayload = {
      customerName: payload.customerName,
      website: payload.website || null,
      customerPhoneNumber: fullPhoneNumber,
      industryVerticalId: payload.industryVerticalId || null,
      createdBy: payload.createdBy
    };

    this.isLoading = true;
    this.companyContactService.addCompany(backendPayload)
      .pipe(finalize(() => { 
          this.isLoading = false; 
          this.cdr.detectChanges(); 
        }))
      .subscribe({
        next: (newlyCreatedCustomer) => { 
          alert('Customer added successfully!');
          
         
          this.customerContactMap[payload.customerName] = {
            contacts: [], 
            isActive: true,
            isHidden: false
          };
          
          
          this.customerDataSource = [
            ...this.customerDataSource, 
            { name: payload.customerName, disabled: false }
          ];

          
          this.newDeal.customerName = payload.customerName;

         
          this.onCustomerChange(payload.customerName);
          
          
          this.closeQuickCreateCustomerModal();
          
        },
        error: (err) => {
          console.error('Customer creation failed:', err);
          alert(err.message || 'Failed to create customer.');
        }
      });
  }
  
  openQuickCreateContactModal() {
    if (!this.newDeal.customerName) {
      alert('Please select a customer first.');
      return;
    }
    this.contactData = { FirstName: '', LastName: '', Designation: '', customerName: this.newDeal.customerName, Email: '', phoneNo: '', countryCode: '+91' };
    this.isContactModalVisible = true;
  }
 
  closeQuickCreateContactModal() {
    this.isContactModalVisible = false;
    this.contactData = { FirstName: '', LastName: '', Designation: '', customerName: '', Email: '', phoneNo: '', countryCode: '+91' };
  }
 
    addNewContact(newContactData: QuickContactFormData) {
    const fullPhoneNumber = `${newContactData.countryCode} ${newContactData.phoneNo}`;
    const payload: Contact = {
      firstName: newContactData.FirstName,
      lastName: newContactData.LastName || '',
      designation: newContactData.Designation,
      email: newContactData.Email,
      phoneNo: newContactData.phoneNo,
      customerName: this.newDeal.customerName,
      countryCode: newContactData.countryCode,
      createdBy: this.authService.userId
    };
    const backendPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      designation: payload.designation,
      email: payload.email,
      phoneNumber: fullPhoneNumber,
      customerName: payload.customerName,
      createdBy: payload.createdBy
    };

    this.isLoading = true;
    this.companyContactService.addContact(backendPayload)
      .pipe(finalize(() => { 
          this.isLoading = false;
          this.cdr.detectChanges(); 
      }))
      .subscribe({
        next: (newlyCreatedContact) => { 
          alert('Contact added successfully!');

         
          const fullName = `${payload.firstName} ${payload.lastName}`.trim();

          
          if (this.customerContactMap[this.newDeal.customerName]) {
            this.customerContactMap[this.newDeal.customerName].contacts.push(fullName);
           
            this.filteredContacts = [...this.customerContactMap[this.newDeal.customerName].contacts];
          }
          
          
          this.newDeal.contactName = fullName;
          
          
          this.onContactChange(fullName);
          
         
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
    const dataField = `custom_${newField.fieldLabel.toLowerCase().replace(/\s+/g, '_')}`;
    this.customFields.push({
      fieldLabel: newField.fieldLabel,
      fieldType: newField.fieldType,
      dataField: dataField,
      required: false,
    });
    this.newDeal[dataField] = newField.fieldType.toLowerCase() === 'boolean' ? false : (newField.fieldType.toLowerCase() === 'numerical' || newField.fieldType.toLowerCase() === 'date' ? null : '');
    this.cdr.detectChanges();
    this.closeCustomizeFieldModal();
  }
 
  getEditorType(fieldType: string): string {
    switch (fieldType.toLowerCase()) {
      case 'text': return 'dxTextBox';
      case 'numerical': return 'dxNumberBox';
      case 'boolean': return 'dxCheckBox';
      case 'date': return 'dxDateBox';
      default: return 'dxTextBox';
    }
  }
 
  getEditorOptions(fieldType: string): any {
    switch (fieldType.toLowerCase()) {
      case 'text': return { placeholder: `Enter ${fieldType}` };
      case 'numerical': return { showSpinButtons: true };
      case 'boolean': return {};
      case 'date': return { displayFormat: 'dd/MMM/yyyy' };
      default: return {};
    }
  }
  trackByDataField(index: number, field: { dataField: string }): string {
    return field.dataField;
  }
}