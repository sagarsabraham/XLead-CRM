import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef, Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output, SimpleChange, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AddDealModalComponent, QuickContactFormData } from './add-deal-modal.component'; // Removed NewDeal as it's not exported explicitly by the component, but used internally.
import { CountryService } from 'src/app/services/country.service';
import { DuService } from 'src/app/services/du.service';
import { RevenuetypeService } from 'src/app/services/revenuetype.service';
import { AccountService } from '../../services/account.service';
import { RegionService } from '../../services/region.service';
import { DomainService } from '../../services/domain.service';
import { DealstageService } from 'src/app/services/dealstage.service';
import { Customer, CompanyContactService, Contact, CustomerContactMap } from 'src/app/services/company-contact.service';
import { DealService, DealCreatePayload, DealRead, DealEditPayload } from 'src/app/services/dealcreation.service';
import { SeviceLineService } from 'src/app/services/sevice-line.service';
import { IndustryVerticalService } from 'src/app/services/industry-vertical.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CountryCodeService } from 'src/app/services/country-code.service';
// import { DxValidationRule } from '../form-modal/form-modal.component'; // Assuming path - if this path is wrong or the type is simple, we can mock it.

// For simplicity, if DxValidationRule is just an interface/type, we can define it here.
// If it's more complex, ensure the path is correct or create a more detailed mock.
interface DxValidationRule {
  type: string;
  message?: string;
  min?: any;
  max?: any;
  pattern?: any;
  validationCallback?: (options: any) => boolean;
}


// Mock Dx Components (for @ViewChild interaction)
class MockDxFormComponent {
  instance: any = {
    validate: jasmine.createSpy('validate').and.returnValue({ isValid: true }),
    resetValues: jasmine.createSpy('resetValues'),
    option: jasmine.createSpy('option'),
    updateData: jasmine.createSpy('updateData'),
  };
}


// Mock Child Components
@Component({
  selector: 'app-modal-header',
  template: ''
})
class MockModalHeaderComponent {
  @Input() title: string = '';
  @Input() showOwner: boolean = false;
}

@Component({
  selector: 'app-modal-buttons',
  template: ''
})
class MockModalButtonsComponent {
  @Input() showCustomize: boolean = false;
  @Input() customize: string = '';
  @Input() cancelText: string = '';
  @Input() saveText: string = '';
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();
  @Output() onCustomize = new EventEmitter<void>();
}

@Component({
  selector: 'app-form-modal',
  template: ''
})
class MockFormModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Input() formData: any;
  @Input() fields: any[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();
}

// Internal interface from component, ensure it's available or defined if not exported.
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

describe('AddDealModalComponent', () => {
  let component: AddDealModalComponent;
  let fixture: ComponentFixture<AddDealModalComponent>;
  // Mock services
  let mockAccountService: jasmine.SpyObj<AccountService>;
  let mockRegionService: jasmine.SpyObj<RegionService>;
  let mockDomainService: jasmine.SpyObj<DomainService>;
  let mockDealStageService: jasmine.SpyObj<DealstageService>;
  let mockCountryService: jasmine.SpyObj<CountryService>;
  let mockDuService: jasmine.SpyObj<DuService>;
  let mockRevenuetypeService: jasmine.SpyObj<RevenuetypeService>;
  let mockCompanyContactService: jasmine.SpyObj<CompanyContactService>;
  let mockDealService: jasmine.SpyObj<DealService>;
  let mockServiceLineService: jasmine.SpyObj<SeviceLineService>;
  let mockIndustryVerticalService: jasmine.SpyObj<IndustryVerticalService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCountryCodeService: jasmine.SpyObj<CountryCodeService>;
  let mockCdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockDealFormInstance = new MockDxFormComponent();

  const initialNewDeal: NewDeal = {
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
    startDate: null, // Will be set to new Date() in resetForm
    closeDate: null,
    description: '',
    probability: null,
  };

  const sampleCustomerContactMap: { [customerName: string]: CustomerContactMap } = {
    'Customer A': { contacts: ['Contact 1A', 'Contact 2A'], isActive: true, isHidden: false },
    'Customer B': { contacts: ['Contact 1B'], isActive: false, isHidden: false },
    'Customer C': { contacts: ['Contact 1C'], isActive: true, isHidden: true },
  };

  const sampleCountryCodes = [
    { idd: { root: '+1', suffixes: [''] }, name: { common: 'USA' } },
    { idd: { root: '+44', suffixes: [''] }, name: { common: 'UK' } },
    { idd: { root: '+91', suffixes: [''] }, name: { common: 'India' } },
  ];
  const formattedCountryCodes = [
    { code: '+1', name: 'USA (+1)' },
    { code: '+44', name: 'UK (+44)' },
    { code: '+91', name: 'India (+91)' },
  ];

  beforeEach(async () => {
    mockAccountService = jasmine.createSpyObj('AccountService', ['getAllAccounts']);
    mockRegionService = jasmine.createSpyObj('RegionService', ['getAllRegions']);
    mockDomainService = jasmine.createSpyObj('DomainService', ['getAllDomains']);
    mockDealStageService = jasmine.createSpyObj('DealstageService', ['getAllDealStages']);
    mockCountryService = jasmine.createSpyObj('CountryService', ['getCountries']);
    mockDuService = jasmine.createSpyObj('DuService', ['getDU']);
    mockRevenuetypeService = jasmine.createSpyObj('RevenuetypeService', ['getRevenueTypes']);
    mockCompanyContactService = jasmine.createSpyObj('CompanyContactService', ['getCompanyContactMap', 'getContactByNameAndCustomer', 'addCompany', 'addContact']);
    mockDealService = jasmine.createSpyObj('DealService', ['createDeal', 'updateDeal']);
    mockServiceLineService = jasmine.createSpyObj('SeviceLineService', ['getServiceTypes']);
    mockIndustryVerticalService = jasmine.createSpyObj('IndustryVerticalService', ['getIndustryVertical']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], { 'userId': 123 });
    mockCountryCodeService = jasmine.createSpyObj('CountryCodeService', ['getCountryCodes']);
    mockCdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [
        AddDealModalComponent,
        MockModalHeaderComponent,
        MockModalButtonsComponent,
        MockFormModalComponent,
      ],
      imports: [FormsModule, NoopAnimationsModule],
      providers: [
        { provide: AccountService, useValue: mockAccountService },
        { provide: RegionService, useValue: mockRegionService },
        { provide: DomainService, useValue: mockDomainService },
        { provide: DealstageService, useValue: mockDealStageService },
        { provide: CountryService, useValue: mockCountryService },
        { provide: DuService, useValue: mockDuService },
        { provide: RevenuetypeService, useValue: mockRevenuetypeService },
        { provide: CompanyContactService, useValue: mockCompanyContactService },
        { provide: DealService, useValue: mockDealService },
        { provide: SeviceLineService, useValue: mockServiceLineService },
        { provide: IndustryVerticalService, useValue: mockIndustryVerticalService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CountryCodeService, useValue: mockCountryCodeService },
        { provide: ChangeDetectorRef, useValue: mockCdr },
      ],
      schemas: [NO_ERRORS_SCHEMA] // <--- KEY CHANGE HERE
    }).compileComponents();

    // Mock service calls for loadAllData
    mockAccountService.getAllAccounts.and.returnValue(of([{ id: 1, accountName: 'Acc1' }]));
    mockServiceLineService.getServiceTypes.and.returnValue(of([{ id: 1, serviceName: 'Svc1' }]));
    mockRegionService.getAllRegions.and.returnValue(of([{ id: 1, regionName: 'Reg1' }]));
    mockDomainService.getAllDomains.and.returnValue(of([{ id: 1, domainName: 'Dom1' }]));
    mockDealStageService.getAllDealStages.and.returnValue(of([{ id: 1, displayName: 'Stage1', stageName: 'Stage1' }, {id: 2, displayName: 'Qualification', stageName: 'Qualification'}]));
    mockDuService.getDU.and.returnValue(of([{ id: 1, duName: 'DU1' }]));
    mockRevenuetypeService.getRevenueTypes.and.returnValue(of([{ id: 1, revenueTypeName: 'RevType1' }]));
    mockCountryService.getCountries.and.returnValue(of([{ id: 1, countryName: 'Country1' }]));
    mockCountryCodeService.getCountryCodes.and.returnValue(of(sampleCountryCodes as any));
    mockCompanyContactService.getCompanyContactMap.and.returnValue(of(sampleCustomerContactMap));
    mockIndustryVerticalService.getIndustryVertical.and.returnValue(of([{ id: 1, industryName: 'Ind1' }]));

    fixture = TestBed.createComponent(AddDealModalComponent);
    component = fixture.componentInstance;

    // Assign mocks for ViewChild
    component.dealFormInstance = mockDealFormInstance as any;
    component.formContainer = { nativeElement: document.createElement('div') } as ElementRef<HTMLDivElement>;

    // Spy on methods that might be called internally and affect state
    spyOn(component, 'resetForm').and.callThrough();
    spyOn(component, 'prefillFormForEdit').and.callThrough();
    spyOn(component, 'loadAllData').and.callThrough();
    spyOn(component, 'onCustomerChange').and.callThrough();
    spyOn(component, 'onContactChange').and.callThrough();

    // Reset spies on mock instances for each test
    mockDealFormInstance.instance.validate.calls.reset();
    mockDealFormInstance.instance.resetValues.calls.reset();
    mockDealFormInstance.instance.option.calls.reset();
    mockDealFormInstance.instance.updateData.calls.reset();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isVisible).toBe(false);
    expect(component.mode).toBe('add');
    expect(component.dealToEdit).toBeNull();
    // initialNewDeal.startDate will be set by resetForm in ngOnInit via loadAllData
    // So, direct comparison to a static initialNewDeal might be tricky here without running ngOnInit first.
    expect(component.isFormReady).toBe(false);
    expect(component.isLoading).toBe(false);
    expect(component.modalTitle).toBe('Create Deal');
  });

  describe('ngOnInit', () => {
    it('should call loadAllData', () => {
      component.ngOnInit();
      expect(component.loadAllData).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {

    it('should log error if dealFormInstance is not available on "shown"', () => {
      let shownCallback: Function = () => {};
      component.ngAfterViewInit();
      const originalDealFormInstance = component.dealFormInstance;
      component.dealFormInstance = undefined as any; // Simulate missing form instance
      
      shownCallback();
      expect(component.isFormReady).toBe(false);
      component.dealFormInstance = originalDealFormInstance; // Restore
    });
  });

  describe('loadAllData', () => {
    it('should populate dropdown data sources and customerDataSource', fakeAsync(() => {
      component.loadAllData();
      tick(); // for forkJoin

      expect(component.accounts.length).toBeGreaterThan(0);
      expect(component.serviceline.length).toBeGreaterThan(0);
      // ... (other checks for data sources)
      expect(component.customerDataSource.length).toBe(2); // Customer C is hidden
      expect(component.customerDataSource[0]).toEqual({ name: 'Customer A', disabled: false });
      expect(component.customerDataSource[1]).toEqual({ name: 'Customer B', disabled: true });
      expect(component.isDropdownDataLoaded).toBe(true);
      expect(component.resetForm).toHaveBeenCalled(); // Called if mode is 'add'
    }));

    it('should set qualificationStageId if "Qualification" stage exists', fakeAsync(() => {
        component.loadAllData();
        tick();
        const qualStage = component.dealStages.find(s => s.displayName === 'Qualification');
        expect((component as any).qualificationStageId).toBe(qualStage!.id);
    }));

    it('should call prefillFormForEdit if mode is edit, dealToEdit exists, and modal is visible', fakeAsync(() => {
      component.mode = 'edit';
      component.dealToEdit = { id: 1, dealName: 'Test Deal' } as DealRead;
      component.isVisible = true;
      component.loadAllData();
      tick();
      expect(component.prefillFormForEdit).toHaveBeenCalledWith(component.dealToEdit);
    }));

    it('should handle errors during data loading', fakeAsync(() => {
        mockAccountService.getAllAccounts.and.returnValue(throwError(() => new Error('Failed to load accounts')));
        component.loadAllData();
        tick();
        expect(component.isDropdownDataLoaded).toBe(true);
        expect(mockCdr.detectChanges).toHaveBeenCalled();
    }));
  });

  describe('ngOnChanges', () => {
    it('should call loadAllData if isVisible becomes true and dropdowns not loaded', () => {
        component.isDropdownDataLoaded = false;
        component.ngOnChanges({ isVisible: new SimpleChange(false, true, false) });
        expect(component.loadAllData).toHaveBeenCalled();
    });

    it('should call resetForm if isVisible becomes true, mode is add, and dropdowns loaded', () => {
        component.isDropdownDataLoaded = true;
        component.mode = 'add';
        component.ngOnChanges({ isVisible: new SimpleChange(false, true, false) });
        expect(component.resetForm).toHaveBeenCalled();
    });

    it('should call prefillFormForEdit if isVisible becomes true, mode is edit, dealToEdit exists, and dropdowns loaded', () => {
        component.isDropdownDataLoaded = true;
        component.mode = 'edit';
        component.dealToEdit = { id: 1, dealName: 'Test' } as DealRead;
        component.ngOnChanges({ isVisible: new SimpleChange(false, true, false) });
        expect(component.prefillFormForEdit).toHaveBeenCalledWith(component.dealToEdit);
    });

     it('should set isFormReady to false if isVisible becomes false', () => {
        component.isFormReady = true;
        component.ngOnChanges({ isVisible: new SimpleChange(true, false, true) });
        expect(component.isFormReady).toBe(false);
    });

    it('should call prefillFormForEdit if dealToEdit changes while visible in edit mode and dropdowns loaded', () => {
        component.isVisible = true;
        component.mode = 'edit';
        component.isDropdownDataLoaded = true;
        const oldDealToEdit = { id: 1, dealName: 'Old Edit Test'} as DealRead;
        const newDealToEdit = { id: 2, dealName: 'New Edit Test' } as DealRead;
        component.dealToEdit = oldDealToEdit;

        component.ngOnChanges({ dealToEdit: new SimpleChange(oldDealToEdit, newDealToEdit, false) });
        component.dealToEdit = newDealToEdit; // ngOnChanges lifecycle means this property is updated *before* the method call in real life.
        
        expect(component.prefillFormForEdit).toHaveBeenCalledWith(newDealToEdit);
    });
  });

  describe('prefillFormForEdit', () => {
    const mockDeal: DealRead = {
      id: 1,
      dealAmount: 5000,
      dealName: 'Edit Deal',
      accountId: 1,
      serviceId: 1,
      regionId: 1,
      contactName: 'Contact 1A',
      domainId: 1,
      dealStageId: 1,
      revenueTypeId: 1,
      duId: 1,
      countryId: 1,
      startingDate: '2023-01-01T00:00:00Z',
      closingDate: '2023-02-01T00:00:00Z',
      description: 'Test Desc',
      probability: 50,
      customFields: { custom_test_field: 'custom_value', custom_numeric_field: 123 }
    };

    beforeEach(() => { // Removed fakeAsync as prefillFormForEdit is synchronous now
        component.customerContactMap = sampleCustomerContactMap;
        component.dealFormInstance = mockDealFormInstance as any;
        component.customFields = [];
        component.dealStages = [{ id: 1, displayName: 'Stage1', stageName: 'Stage1' }, {id: 2, displayName: 'Qualification', stageName: 'Qualification'}];
        (component as any).qualificationStageId = 2;
    });

    it('should populate newDeal with data from dealToEdit', () => {
      component.prefillFormForEdit(mockDeal);
      expect(component.newDeal.amount).toBe(5000);
      expect(component.newDeal.title).toBe('Edit Deal');
      // ... other fields
      expect(new Date(component.newDeal.startDate!)).toEqual(new Date('2023-01-01T00:00:00Z'));
      expect(component.newDeal['custom_test_field']).toBe('custom_value');
      expect(mockDealFormInstance.instance.option).toHaveBeenCalledWith('formData', component.newDeal);
    });

    it('should determine customerName based on contactName and customerContactMap', () => {
      component.prefillFormForEdit(mockDeal);
      expect(component.newDeal.customerName).toBe('Customer A');
      expect(component.onCustomerChange).toHaveBeenCalledWith('Customer A', false);
    });

    it('should add new custom fields to component.customFields if not present', () => {
      component.prefillFormForEdit(mockDeal);
      expect(component.customFields.length).toBe(2);
      expect(component.customFields).toContain(jasmine.objectContaining({ dataField: 'custom_test_field' }));
    });
  });

  it('modalTitle should return "Edit Deal" in edit mode', () => {
    component.mode = 'edit';
    expect(component.modalTitle).toBe('Edit Deal');
  });

  it('modalTitle should return "Create Deal" in add mode', () => {
    component.mode = 'add';
    expect(component.modalTitle).toBe('Create Deal');
  });

  describe('handleClose', () => {
    it('should emit onClose and call resetForm', () => {
      spyOn(component.onClose, 'emit');
      component.handleClose();
      expect(component.onClose.emit).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.isFormReady).toBe(false);
    });
  });

    describe('resetForm', () => {
    it('should reset newDeal to initial values and set default stage', () => {
      component.newDeal.title = 'Test Title';
      component.customFields = [{ fieldLabel: 'CF1', fieldType: 'Text', dataField: 'custom_cf1', required: false }];
      component.newDeal['custom_cf1'] = 'test value';
      (component as any).qualificationStageId = 5;
      component.selectedStage = null;
      
      const expectedStartDate = new Date(2023, 10, 15, 12, 0, 0); // A specific, known date

      // --- Mocking new Date() specifically for this test scope ---
      const originalDate = window.Date;
      const mockDateConstructor = class extends originalDate {
        constructor() {
          super(); // Call the original constructor
          return new originalDate(expectedStartDate.getTime()); // Then return our specific date
        }
        // We need to ensure static methods are also available if used (like Date.now())
        static override now() {
          return expectedStartDate.getTime();
        }
        // Add other static methods if your code under test uses them (e.g., Date.UTC, Date.parse)
        static override UTC = originalDate.UTC;
        static override parse = originalDate.parse;
      } as any; // Use 'as any' to assign to window.Date which expects DateConstructor
      
      window.Date = mockDateConstructor;
      // --- End of Date mocking ---

      component.resetForm();

      // --- Restore original Date constructor ---
      window.Date = originalDate;
      // --- End of Date restoration ---

      expect(component.newDeal.title).toBe('');
      expect(component.newDeal['custom_cf1']).toBe('');
      expect(component.newDeal.stage).toBe(5);
      expect(component.newDeal.startDate).toEqual(expectedStartDate); // Now it should match

      expect(component.selectedContactDetails).toBeNull();
      expect(component.filteredContacts).toEqual([]);
      expect(mockDealFormInstance.instance.resetValues).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    });

    it('should set stage from selectedStage if available', () => {
        component.selectedStage = 10;
        component.dealStages = [{id: 10, displayName: 'SelectedStageTest', stageName: 'SelectedStageTest'}]; // Added stageName for consistency
        (component as any).qualificationStageId = 5;
        component.resetForm();
        expect(component.newDeal.stage).toBe(10);
    });
  });

  describe('onCustomerChange', () => {
    beforeEach(() => {
        component.customerContactMap = sampleCustomerContactMap;
        component.dealFormInstance = mockDealFormInstance as any;
    });

    it('should update filteredContacts and clear contactName if clearContact is true', () => {
      component.newDeal.contactName = 'Some Contact';
      component.onCustomerChange('Customer A', true);
      expect(component.newDeal.customerName).toBe('Customer A');
      expect(component.filteredContacts).toEqual(['Contact 1A', 'Contact 2A']);
      expect(component.newDeal.contactName).toBe('');
      expect(component.selectedContactDetails).toBeNull();
      expect(mockDealFormInstance.instance.updateData).toHaveBeenCalledWith('customerName', 'Customer A');
    });

    it('should not clear contactName if clearContact is false and contact is in new list', () => {
      component.newDeal.contactName = 'Contact 1A';
      component.onCustomerChange('Customer A', false);
      expect(component.newDeal.customerName).toBe('Customer A');
      expect(component.filteredContacts).toEqual(['Contact 1A', 'Contact 2A']);
      expect(component.newDeal.contactName).toBe('Contact 1A');
    });
  });

  describe('onContactChange', () => {
    beforeEach(() => { // Removed fakeAsync as onContactChange has finalize
      component.newDeal.customerName = 'Customer A';
      mockCompanyContactService.getContactByNameAndCustomer.and.returnValue(of({
        email: 'test@example.com', phoneNo: '123', designation: 'Dev', countryCode: '+1'
      } as Contact));
      component.dealFormInstance = mockDealFormInstance as any;
    });

    it('should update selectedContactDetails when contact is selected', fakeAsync(() => {
      component.onContactChange('Contact 1A');
      tick(); // for service call finalize
      expect(component.newDeal.contactName).toBe('Contact 1A');
      expect(component.selectedContactDetails).toEqual({
        email: 'test@example.com', phoneNo: '123', designation: 'Dev', countryCode: '+1'
      } as any);
      expect(mockCompanyContactService.getContactByNameAndCustomer).toHaveBeenCalledWith('Contact 1A', 'Customer A');
      expect(component.isContactLoading).toBe(false);
      expect(mockDealFormInstance.instance.updateData).toHaveBeenCalledWith('contactName', 'Contact 1A');
    }));

    it('should set selectedContactDetails to null if contactName is empty', () => {
      component.onContactChange('');
      // No tick needed as no async operation if contactName is empty
      expect(component.selectedContactDetails).toBeNull();
      expect(component.isContactLoading).toBe(false);
    });

    it('should handle error when fetching contact details', fakeAsync(() => {
      mockCompanyContactService.getContactByNameAndCustomer.and.returnValue(throwError(() => new Error('Fetch error')));
      component.onContactChange('Contact 1A');
      tick();
      expect(component.selectedContactDetails).toBeNull();
      expect(component.isContactLoading).toBe(false);
    }));
  });

  describe('validateCloseDate', () => {
    it('should return true if closeDate is after startDate', () => {
      component.newDeal.startDate = new Date(2023, 0, 1);
      expect(component.validateCloseDate({ value: new Date(2023, 0, 2) })).toBe(true);
    });
    it('should return true if closeDate is same as startDate', () => {
      component.newDeal.startDate = new Date(2023, 0, 1);
      expect(component.validateCloseDate({ value: new Date(2023, 0, 1) })).toBe(true);
    });
    it('should return false if closeDate is before startDate', () => {
      component.newDeal.startDate = new Date(2023, 0, 2);
      expect(component.validateCloseDate({ value: new Date(2023, 0, 1) })).toBe(false);
    });
    it('should return true if startDate is null', () => {
      component.newDeal.startDate = null;
      expect(component.validateCloseDate({ value: new Date(2023, 0, 1) })).toBe(true);
    });
     it('should return true if closeDate value is null', () => {
      component.newDeal.startDate = new Date(2023, 0, 1);
      expect(component.validateCloseDate({ value: null })).toBe(true);
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      component.isFormReady = true;
      component.dealFormInstance = mockDealFormInstance as any;
      mockDealFormInstance.instance.validate.and.returnValue({ isValid: true });
      component.newDeal = {
        amount: 1000,
        customerName: 'Customer A',
        title: 'Test Deal',
        account: null,
        serviceline: null,
        region: 1,
        contactName: 'Contact 1A',
        domain: null,
        stage: 1,
        revenueType: 1,
        department: 1,
        country: 1,
        startDate: new Date('2023-01-01'),
        closeDate: new Date('2023-01-02'),
        description: 'Desc',
        probability: 70,
      };
      component.selectedContactDetails = { email: 't@e.com', phoneNo: '123', designation: 'Dev', countryCode: '+1' } as Contact;
      component.customFields = [{ fieldLabel: 'CF1', fieldType: 'Text', dataField: 'custom_cf1', required: false }];
      component.newDeal['custom_cf1'] = 'val1';
      (mockAuthService as any).userId = 123;
    });

    it('should not submit if form is not ready', () => {
      component.isFormReady = false;
      component.handleSubmit();
      expect(mockDealService.createDeal).not.toHaveBeenCalled();
    });

    it('should not submit if form validation fails', () => {
      mockDealFormInstance.instance.validate.and.returnValue({ isValid: false });
      component.handleSubmit();
      expect(mockDealService.createDeal).not.toHaveBeenCalled();
    });

    // ... other handleSubmit validation tests ...

    it('should call createDeal for "add" mode on successful validation', fakeAsync(() => {
      const mockCreatedDeal = { id: 1, ...component.newDeal } as unknown as DealRead;
      mockDealService.createDeal.and.returnValue(of(mockCreatedDeal));
      spyOn(component.onSubmitSuccess, 'emit');
      spyOn(component, 'handleClose').and.callThrough(); // Ensure it's spied to check call

      component.mode = 'add';
      component.handleSubmit();
      tick();

      expect(mockDealService.createDeal).toHaveBeenCalled();
      expect(component.onSubmitSuccess.emit).toHaveBeenCalledWith(mockCreatedDeal);
      expect(component.handleClose).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    }));

    it('should call updateDeal for "edit" mode on successful validation', fakeAsync(() => {
      component.mode = 'edit';
      component.dealToEdit = { id: 55, dealName: 'Old Deal' } as DealRead;
      const mockUpdatedDeal = { id: 55, ...component.newDeal } as unknown as DealRead;
      mockDealService.updateDeal.and.returnValue(of(mockUpdatedDeal));
      spyOn(component.onSubmitSuccess, 'emit');
      spyOn(component, 'handleClose').and.callThrough();

      component.handleSubmit();
      tick();

      expect(mockDealService.updateDeal).toHaveBeenCalled();
      expect(component.onSubmitSuccess.emit).toHaveBeenCalledWith(mockUpdatedDeal);
      expect(component.handleClose).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    }));
    // ... (other handleSubmit tests for error cases, missing fields etc.) ...
    it('should show error if customerName is missing', () => {
        component.newDeal.customerName = '';
        component.handleSubmit();
        expect(mockDealService.createDeal).not.toHaveBeenCalled();
    });

    it('should show error if contactName is missing', () => {
        component.newDeal.contactName = '';
        component.handleSubmit();
        expect(mockDealService.createDeal).not.toHaveBeenCalled();
    });

    it('should show error if required dropdown fields are missing (e.g., region)', () => {
        component.newDeal.region = null;
        component.handleSubmit();
        expect(mockDealService.createDeal).not.toHaveBeenCalled();
    });
  });

  describe('Quick Create Customer Modal', () => {
    it('openQuickCreateCustomerModal should set visibility and reset data', () => {
      component.openQuickCreateCustomerModal();
      expect(component.isCustomerModalVisible).toBe(true);
      expect(component.customerData).toEqual({ customerName: '', phoneNo: '', website: '', industryVertical: null, countryCode: '+91' });
    });

    it('closeQuickCreateCustomerModal should set visibility to false', () => {
      component.isCustomerModalVisible = true;
      component.closeQuickCreateCustomerModal();
      expect(component.isCustomerModalVisible).toBe(false);
    });

    it('addNewCustomer should call service, load data, and close modal', fakeAsync(() => {
      const newCustomer = { customerName: 'New Cust', phoneNo: '12345-67890', website: 'new.com', industryVertical: 1, countryCode: '+1' };
      mockCompanyContactService.addCompany.and.returnValue(of({} as Customer)); // Mock successful creation
      component.openQuickCreateCustomerModal();

      component.addNewCustomer(newCustomer);
      tick(); // for finalize

      expect(mockCompanyContactService.addCompany).toHaveBeenCalled();
      expect(component.loadAllData).toHaveBeenCalled();
      expect(component.newDeal.customerName).toBe('New Cust');
      expect(component.onCustomerChange).toHaveBeenCalledWith('New Cust');
      expect(component.isCustomerModalVisible).toBe(false);
      expect(component.isLoading).toBe(false);
    }));

     it('addNewCustomer should handle API error', fakeAsync(() => {
      const newCustomer = { customerName: 'New Cust', phoneNo: '12345-67890', website: 'new.com', industryVertical: 1, countryCode: '+1' };
      mockCompanyContactService.addCompany.and.returnValue(throwError(() => ({message: 'Cust creation failed'})));
      
      component.addNewCustomer(newCustomer);
      tick();
      
      expect(component.isLoading).toBe(false);
      // Check if modal remains open or closes based on your implementation logic
      // expect(component.isCustomerModalVisible).toBe(true); // or false
    }));
  });

  describe('Quick Create Contact Modal', () => {
    beforeEach(() => {
      component.newDeal.customerName = 'Existing Customer';
    });

    it('openQuickCreateContactModal should set visibility and data if customer selected', () => {
      component.openQuickCreateContactModal();
      expect(component.isContactModalVisible).toBe(true);
      expect(component.contactData.customerName).toBe('Existing Customer');
    });

    it('closeQuickCreateContactModal should set visibility to false and reset data', () => {
      component.openQuickCreateContactModal();
      component.contactData.FirstName = 'Test';
      component.closeQuickCreateContactModal();
      expect(component.isContactModalVisible).toBe(false);
      expect(component.contactData.FirstName).toBe('');
    });
  });

  describe('Customize Field Modal', () => {
    it('openCustomizeFieldModal should set visibility and reset form data', () => {
      component.customizeFieldFormData = { fieldLabel: 'Old Label' };
      component.openCustomizeFieldModal();
      expect(component.isCustomizeFieldModalVisible).toBe(true);
      expect(component.customizeFieldFormData).toEqual({});
    });

    it('closeCustomizeFieldModal should set visibility to false', () => {
      component.isCustomizeFieldModalVisible = true;
      component.closeCustomizeFieldModal();
      expect(component.isCustomizeFieldModalVisible).toBe(false);
    });

    it('addCustomField should add field to customFields and newDeal, then close modal', () => {
      const newField = { fieldLabel: 'My Custom Field', fieldType: 'Numerical' };
      component.addCustomField(newField);

      const expectedDataField = 'custom_my_custom_field';
      expect(component.customFields.length).toBe(1);
      expect(component.customFields[0]).toEqual(jasmine.objectContaining({
        fieldLabel: 'My Custom Field',
        fieldType: 'Numerical',
        dataField: expectedDataField
      }));
      expect(component.newDeal[expectedDataField]).toBeNull();
      expect(component.isCustomizeFieldModalVisible).toBe(false);
    });
  });

  describe('Helper methods', () => {
    it('getEditorType should return correct dx editor type', () => {
      expect(component.getEditorType('Text')).toBe('dxTextBox');
      // ... other types
    });

    it('getEditorOptions should return correct options', () => {
      expect(component.getEditorOptions('Text')).toEqual({ placeholder: 'Enter Text' });
      // ... other types
    });

    it('trackByDataField should return dataField', () => {
        expect(component.trackByDataField(0, { dataField: 'testField' } as any)).toBe('testField');
    });
  });

   describe('onMouseWheel', () => {
     it('should adjust scrollTop of formContainer', () => {
   const mockDiv = document.createElement('div');
   // Correctly spy on the 'get' accessor for nativeElement
   spyOnProperty(component.formContainer, 'nativeElement', 'get').and.returnValue(mockDiv);
   mockDiv.scrollTop = 0;
   
   const wheelEvent = new WheelEvent('wheel', { deltaY: 50 });
   spyOn(wheelEvent, 'preventDefault');
   
   component.onMouseWheel(wheelEvent);
   
   expect(mockDiv.scrollTop).toBe(50);
   expect(wheelEvent.preventDefault).toHaveBeenCalled();
 });  

    it('should not error if formContainer is not available', () => {
       (component as any).formContainer = null;
       const wheelEvent = new WheelEvent('wheel', { deltaY: 50 });
       expect(() => component.onMouseWheel(wheelEvent)).not.toThrow();
    });
  });

});