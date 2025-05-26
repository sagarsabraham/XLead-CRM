
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CompanyContactService } from '../company-contact.service';
import { Contact } from '../company-contact.model';
import { finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-deal-modal',
  templateUrl: './add-deal-modal.component.html',
  styleUrls: ['./add-deal-modal.component.css']
})
export class AddDealModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() stages: string[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  isDropdownOpen: boolean = false;
  isCompanyModalVisible: boolean = false;
  isContactModalVisible: boolean = false;
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
    companyName: '',
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

  companies: string[] = [];
  companyContactMap: { [company: string]: string[] } = {};
  filteredCompanies: string[] = [];
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

  constructor(
    private cdr: ChangeDetectorRef,
    private companyContactService: CompanyContactService
  ) {}

  ngOnInit(): void {
    this.loadCompanyContactData();
  }

  loadCompanyContactData() {
    this.companyContactService.getCompanyContactMap().subscribe(data => {
      this.companyContactMap = data;
      this.companies = Object.keys(data);
      this.filteredCompanies = [...this.companies];
      this.filteredContacts = this.companyContactMap[this.newDeal.companyName] || [];
      this.cdr.detectChanges();
    });
  }

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  handleSubmit() {
    const formattedAmount = `$ ${this.newDeal.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    const formattedDate = this.newDeal.date
      ? this.newDeal.date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : '';

    const documentName =
      this.newDeal.doc && this.newDeal.doc.length > 0 ? this.newDeal.doc[0].name : '';

    const dealData = {
      ...this.newDeal,
      amount: formattedAmount,
      date: formattedDate,
      doc: documentName
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
    this.newDeal.contactName = ''; // Reset contact field when company changes
  }

  openQuickCreateCompanyModal() {
    this.companyData = { companyName: '', phoneNo: '', website: '' };
    this.isCompanyModalVisible = true;
    this.isDropdownOpen = false;
    this.cdr.detectChanges();
  }

  closeQuickCreateCompanyModal() {
    this.isCompanyModalVisible = false;
    this.cdr.detectChanges();
  }

addNewCompany(newCompany: any) {
  const payload = {
    companyName: newCompany.companyName,
    website: newCompany.website,
    companyPhoneNumber: newCompany.phoneNo,
    createdBy: 1
  };

  this.companyContactService.addCompany(payload).subscribe({
    next: () => {
      this.companyContactService.getCompanyContactMap().subscribe(data => {
        this.companyContactMap = data;
        this.companies = Object.keys(data);
        this.filteredCompanies = [...this.companies];
        this.newDeal.companyName = payload.companyName;
        this.newDeal.contactName = '';
        this.filteredContacts = [];
        this.closeQuickCreateCompanyModal();
        this.cdr.detectChanges();
        setTimeout(() => {
          const companyField = document.getElementById('companySelect');
          companyField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          companyField?.focus();
        }, 100);
      });
    },
    error: error => {
      console.error('Company creation failed:', error);
      alert('Failed to create company. Check console for details.');
    }
  });
}


  openQuickCreateContactModal() {
    this.contactData = {
      FirstName: '',
      LastName: '',
      companyName: this.newDeal.companyName || '',
      Email: '',
      phoneNo: ''
    };

    this.isContactModalVisible = true;
    this.isDropdownOpen = false;
    this.cdr.detectChanges();
  }

  closeQuickCreateContactModal() {
    this.isContactModalVisible = false;
    this.cdr.detectChanges();
  }
  onContactChange(contactName: string) {
  this.newDeal.contactName = contactName;
  // Optional: Add any additional logic when contact changes
}
// addNewContact(newContact: Contact) {
//   const payload = {
//     firstName: newContact.FirstName,
//     lastName: newContact.LastName,
//     email: newContact.Email,
//     phoneNumber: newContact.phoneNo,
//     companyName: newContact.companyName,
//     createdBy: 1
    
//   };

//   this.companyContactService.addContact(payload).pipe(
//     switchMap(() => this.companyContactService.getCompanyContactMap()),
//     finalize(() => {
//       this.closeQuickCreateContactModal();
//       this.cdr.detectChanges();

//       // Scroll to and focus the contact field
//       setTimeout(() => {
//         const contactField = document.getElementById('contactSelect');
//         contactField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         contactField?.focus();
//       }, 100);
//     })
//   ).subscribe({
//     next: (data) => {
//       this.companyContactMap = data;
      
    

//       this.filteredCompanies = Object.keys(data);
//       this.filteredContacts = data[payload.companyName] || [];

//       // Set the selected company and contact in the deal form
   
//       this.newDeal.companyName = payload.companyName;
//       this.newDeal.contactName = `${newContact.FirstName} ${newContact.LastName}`;
//     },
//     error: err => {
//       console.error('Error after saving contact:', err);
//       alert('Saved, but server returned an error. Refresh if needed.');
//     }
//   });
// }
addNewContact(newContact: Contact) {
  const payload = {
    firstName: newContact.FirstName,
    lastName: newContact.LastName,
    email: newContact.Email,
    phoneNumber: newContact.phoneNo,
    companyName: newContact.companyName,
    createdBy: 1
  };

  const fullContactName = `${newContact.FirstName} ${newContact.LastName}`.trim();

  this.companyContactService.addContact(payload).pipe(
    switchMap(() => this.companyContactService.getCompanyContactMap()),
    finalize(() => {
      this.closeQuickCreateContactModal();
    })
  ).subscribe({
    next: (data) => {
      // Update the data structures
      this.companyContactMap = data;
      this.filteredCompanies = Object.keys(data);
      
      // Ensure we're working with the correct company
      const targetCompany = payload.companyName;
      this.filteredContacts = data[targetCompany] || [];

      // Set the company and contact in the deal form
      this.newDeal.companyName = targetCompany;
      this.newDeal.contactName = fullContactName;

      // Force immediate change detection
      this.cdr.detectChanges();

      // Enhanced UI interaction after data update
      setTimeout(() => {
        // Focus and highlight the contact dropdown
        const contactSelectBox = document.querySelector('#contactSelect .dx-selectbox-input') as HTMLElement;
        const contactContainer = document.querySelector('#contactSelect') as HTMLElement;
        
        if (contactContainer) {
          // Scroll the container into view
          contactContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add a temporary highlight effect
          contactContainer.style.border = '2px solid #007acc';
          contactContainer.style.transition = 'border 0.3s ease';
          
          // Remove highlight after 2 seconds
          setTimeout(() => {
            contactContainer.style.border = '';
          }, 2000);
        }

        if (contactSelectBox) {
          // Focus the input to show the selected value
          contactSelectBox.focus();
        }

        // Verify the contact exists in the filtered list
        if (!this.filteredContacts.includes(fullContactName)) {
          console.warn('New contact not found in filtered list, refreshing data...');
          this.loadCompanyContactData();
        }
      }, 200);
    },
    error: err => {
      console.error('Error after saving contact:', err);
      alert('Contact creation failed. Please try again.');
    }
  });
}
}