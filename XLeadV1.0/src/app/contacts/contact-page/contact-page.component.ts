import { Component, HostListener, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  
  tableHeaders = [
    { dataField: 'name', caption: 'Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'email', caption: 'Email', visible: true },
    { dataField: 'company', caption: 'Company', visible: false },
    { dataField: 'owner', caption: 'Owner', visible: true, cellTemplate: 'ownerCellTemplate' }
  ];

  tableData: any[] = [];
  totalContacts = 0;
  isMobile: boolean = false;
  isSidebarVisible: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private contactService: ContactService) {
    this.checkIfMobile();
  }

  ngOnInit(): void {
    this.loadContacts();
  }
// In your contact-page.component.ts file
private safeToString(value: any): string {
  return value !== undefined && value !== null ? String(value) : '';
}

// contact-page.component.ts
loadContacts(): void {
  this.isLoading = true;
  this.error = null;
  
  this.contactService.getContacts().subscribe({
    next: (contacts) => {
      this.tableData = contacts.map(contact => ({
        id: this.safeToString(contact.id || `temp-id-${Math.random().toString(36).substring(2)}`), // Fallback for missing IDs
        name: contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
        phone: contact.phoneNumber || '',
        email: contact.email || '',
        company: contact.companyName || '',
        owner: contact.createdBy?.toString() || 'System'
      }));
      
      // Debug: Check for duplicate IDs
      console.log('Contact tableData:', this.tableData);
      const ids = this.tableData.map(item => item.id);
      const uniqueIds = new Set(ids);
      console.log('Unique IDs:', uniqueIds.size, 'Total IDs:', ids.length);
      if (uniqueIds.size !== ids.length) {
        console.error('Duplicate IDs detected:', ids);
      }
      
      this.totalContacts = this.tableData.length;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error fetching contacts:', err);
      this.error = 'Failed to load contacts. Please try again later.';
      this.isLoading = false;
    }
  });
}

  @HostListener('window:resize')
  onResize(): void {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 576;
    if (this.isMobile) {
      this.isSidebarVisible = false;
    } else {
      this.isSidebarVisible = true;
    }
  }

  selectedContactIds: string[] = [];

// Add to ContactPageComponent
handleSelectionChanged(event: any): void {
  console.log('Selection changed:', event);
  console.log('Selected keys:', event.selectedRowKeys);
  console.log('Selected data:', event.selectedRowsData);
  
  // If you want to track selected contacts
  this.selectedContactIds = event.selectedRowKeys || [];
}

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}