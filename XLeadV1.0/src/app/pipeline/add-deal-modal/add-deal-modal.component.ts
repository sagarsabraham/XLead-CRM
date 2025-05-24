import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-deal-modal',
  templateUrl: './add-deal-modal.component.html',
  styleUrls: ['./add-deal-modal.component.css']
})
export class AddDealModalComponent {
  @Input() isVisible: boolean = false;
  @Input() stages: string[] = [];
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
    date: null as Date | null,
    description: '',
    probability: '',
    doc: null as File[] | null
  };

  constructor(private cdr: ChangeDetectorRef) {}

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  handleSubmit() {
    const formattedAmount = `$ ${this.newDeal.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    let formattedDate = '';
    if (this.newDeal.date) {
      formattedDate = this.newDeal.date.toLocaleDateString('en-GB', {
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
      amount: formattedAmount,
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
      date: formattedDate,
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
      date: null,
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