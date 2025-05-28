import { getSupportedInputTypes } from '@angular/cdk/platform';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-deal-modal',
  templateUrl: './add-deal-modal.component.html',
  styleUrls: ['./add-deal-modal.component.css']
})
export class AddDealModalComponent {
  @Input() selectedStage: string = '';
  
  @Input() isVisible: boolean = false;
  @Input() stages: string[] = [];
  @Input() dealToEdit: any = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();
popupWidth = window.innerWidth < 600 ? '90%' : 500;

@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.popupWidth = event.target.innerWidth < 600 ? '90%' : 500;
}


  companyData = {
    companyName: '',
    phoneNo: '',
    website: ''
  };

  companyFields = [
    { dataField: 'companyName', label: 'Company Name', required: true },
    { dataField: 'phoneNo', label: 'Phone Number', required: true },
    { dataField: 'website', label: 'Website', required: true }
  ];
  contactData = {
    FirstName: '',
    LastName: '',
    companyName:'',
    Email: '',
     phoneNo: ''
    
  };

  contactFields = [
    { dataField: 'FirstName', label: 'First Name', required: true },
    { dataField: 'LastName', label: 'Last Name', required: false },
    { dataField: 'companyName', label: 'Company Name', required: true },
     { dataField: 'Email', label: 'Email', required: false },
    { dataField: 'phoneNo', label: 'Phone Number', required: true }
   
  ];
 
 
  isDropdownOpen: boolean = false;
  isCompanyModalVisible: boolean = false;
  isContactModalVisible: boolean = false;
companies: string[] = ['BAYADA', 'Harley Davidson', 'KniTT', 'Hitachi'];
companyContactMap: { [company: string]: string[] } = {
  'BAYADA': ['Abhiram'],
  'Harley Davidson': ['John'],
  'KniTT': [],
  'Hitachi': ['Anna']
};

filteredCompanies: string[] = [...this.companies];
filteredContacts: string[] = [];

  newDeal = {
    salesperson: '',
    amount: 0,
    companyName: '',
    title: '',
    account: '',
    region: '',
    contactName: '',
    domain: '',
    stage: '',
    revenueType: '',
    department: '',
    country: '',
    startDate: null as Date | null, // New field for Starting Date
    closeDate: null as Date | null, // New field for Closing Date
    description: '',
    probability: '',
    doc: null as File[] | null
  };

  constructor(private cdr: ChangeDetectorRef) {}

  // When dealToEdit changes, prefill the form
  ngOnChanges() {
    if (this.dealToEdit && this.mode === 'edit') {
      this.prefillForm();
    }
  if (this.selectedStage && this.newDeal) {
    this.newDeal.stage = this.selectedStage;
  }
  }

  prefillForm() {
    const startDateParts = this.dealToEdit.startDate?.split(' ') || [];
    const startDate = startDateParts.length === 3
    ? new Date(`${startDateParts[1]} ${startDateParts[0]}, ${startDateParts[2]}`)
    : null;

    const closeDateParts = this.dealToEdit.closeDate?.split(' ') || [];
    const closeDate = closeDateParts.length === 3
    ? new Date(`${closeDateParts[1]} ${closeDateParts[0]}, ${closeDateParts[2]}`)
    : null;

    this.newDeal = {
      salesperson: this.dealToEdit.salesperson || '',
      amount: this.dealToEdit.amount || 0,
      companyName: this.dealToEdit.companyName || '',
      title: this.dealToEdit.title || '',
      account: this.dealToEdit.account || '',
      region: this.dealToEdit.region || '',
      contactName: this.dealToEdit.contactName || '',
      domain: this.dealToEdit.domain || '',
      stage: this.dealToEdit.stage || '',
      revenueType: this.dealToEdit.revenueType || '',
      department: this.dealToEdit.department || '',
      country: this.dealToEdit.country || '',
      startDate: startDate,
      closeDate: closeDate,
      description: this.dealToEdit.description || '',
      probability: this.dealToEdit.probability || '',
      doc: this.dealToEdit.doc ? [new File([], this.dealToEdit.doc)] : null
    };

    this.onCompanyChange(this.newDeal.companyName); // Update contacts dropdown
  }

  // Dynamically set the modal title
  get modalTitle(): string {
    return this.mode === 'edit' ? 'Edit Deal' : 'Create Deal';
  }

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  handleSubmit() {
    let formattedCloseDate = '';
    if (this.newDeal.closeDate) {
      formattedCloseDate = this.newDeal.closeDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    let formattedStartDate = '';
    if (this.newDeal.startDate) {
      formattedStartDate = this.newDeal.startDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    const documentName = this.newDeal.doc && this.newDeal.doc.length > 0
      ? this.newDeal.doc[0].name
      : '';

    const dealData = {
      salesperson: this.newDeal.salesperson,
      amount: this.newDeal.amount,
      companyName: this.newDeal.companyName,
      title: this.newDeal.title,
      account: this.newDeal.account,
      region: this.newDeal.region,
      contactName: this.newDeal.contactName,
      domain: this.newDeal.domain,
      stage: this.newDeal.stage,
      revenueType: this.newDeal.revenueType,
      department: this.newDeal.department,
      country: this.newDeal.country,
      startDate: formattedStartDate, // Use formatted start date
      closeDate: formattedCloseDate, // Use formatted close date
      description: this.newDeal.description,
      doc: documentName,
      probability: this.newDeal.probability
    };

    this.onSubmit.emit(dealData);
    this.resetForm();
  }

  resetForm() {
    this.newDeal = {
      salesperson: '',
      amount: 0,
      companyName: '',
      title: '',
      account: '',
      region: '',
      contactName: '',
      domain: '',
      stage: '',
      revenueType: '',
      department: '',
      country: '',
      startDate: null,
      closeDate: null,
      description: '',
      probability: '',
      doc: null
    };
    this.filteredCompanies = [...this.companies];
    this.filteredContacts = [];
    this.isDropdownOpen = false;
  }
  onCompanyChange(company: string) {
  this.newDeal.companyName = company;
  this.filteredContacts = this.companyContactMap[company] || [];
}


  openQuickCreateCompanyModal() {
    this.isCompanyModalVisible = true;
    this.isDropdownOpen = false;
    this.cdr.detectChanges(); 
  }

  closeQuickCreateCompanyModal() {
   
    this.isCompanyModalVisible = false;
    this.cdr.detectChanges();
  }

  addNewCompany(newCompany: any) {
  if (newCompany.companyName && !this.companies.includes(newCompany.companyName)) {
    this.companies.push(newCompany.companyName);
    this.filteredCompanies = [...this.companies];
  }

  if (!this.companyContactMap[newCompany.companyName]) {
    this.companyContactMap[newCompany.companyName] = [];
  }

  this.newDeal.companyName = newCompany.companyName;
  this.filteredContacts = this.companyContactMap[newCompany.companyName];

  this.closeQuickCreateCompanyModal();
}

  openQuickCreateContactModal() {
    this.isContactModalVisible = true;
    this.isDropdownOpen = false;
    this.cdr.detectChanges(); 
  }

  closeQuickCreateContactModal() {
   
    this.isContactModalVisible = false;
    this.cdr.detectChanges();
  }

addNewContact(newContact: any) {
  const fullName = `${newContact.FirstName} ${newContact.LastName}`.trim();
  const company = newContact.companyName;

  if (company) {

    if (!this.companies.includes(company)) {
      this.companies.push(company);
      this.filteredCompanies = [...this.companies];
    }

    if (!this.companyContactMap[company]) {
      this.companyContactMap[company] = [];
    }

    if (!this.companyContactMap[company].includes(fullName)) {
      this.companyContactMap[company].push(fullName);
    }

    this.filteredContacts = [...this.companyContactMap[company]];
  }

  this.newDeal.companyName = company;
  this.newDeal.contactName = fullName;

  this.closeQuickCreateContactModal();
}

  
}