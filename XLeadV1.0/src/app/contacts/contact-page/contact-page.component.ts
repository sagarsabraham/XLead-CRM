import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import { TableComponent } from 'src/app/shared/table/table.component';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  // @ViewChild('appTable') tableComponent!: TableComponent;
  tableHeaders = [
    { dataField: 'name', caption: 'Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'email', caption: 'Email', visible: true },
    { dataField: 'customerName', caption: 'Customer', visible: true },
    { dataField: 'designation', caption: 'Designation', visible: true }, 
    { 
      dataField: 'status', 
      caption: 'Status', 
      visible: true,
      // Add the same lookup configuration here
      lookup: {
        dataSource: [
          { value: 'Active', displayValue: 'Active' },
          { value: 'Inactive', displayValue: 'Inactive' }
        ],
        valueExpr: 'value',
        displayExpr: 'displayValue'
      }
    }
  ];

  tableData: any[] = [];
  totalContacts = 0;
  isMobile: boolean = false;
  isSidebarVisible: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private contactService: CompanyContactService) {
    this.checkIfMobile();
  }

  ngOnInit(): void {
    this.loadContacts();
  }

  private safeToString(value: any): string {
    return value !== undefined && value !== null ? String(value) : '';
  }

  loadContacts(): void {
    this.isLoading = true;
    this.error = null;

   
    forkJoin({
      contacts: this.contactService.getContacts(),
      customers: this.contactService.getCompanies()
    }).subscribe({
      next: ({ contacts, customers }) => {
     
        const customerMap: { [id: number]: string } = {};
        customers.forEach((customer: any) => {
          customerMap[customer.id] = customer.customerName || 'Unknown Customer';
        });

      
        this.tableData = contacts.map(contact => ({
          id: this.safeToString(contact.id || `temp-id-${Math.random().toString(36).substring(2)}`),
          name: contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
          phone: contact.phoneNumber || '',
          email: contact.email || '',
          customerName: contact.customerId ? customerMap[contact.customerId] || 'Unknown Customer' : 'No Customer',
          designation: contact.designation || 'N/A', // Map the designation field
          status: contact.isActive ? 'Active' : 'Inactive',
          owner: contact.createdBy?.toString() || 'System'
        }));

      
        const ids = this.tableData.map(item => item.id);
        const uniqueIds = new Set(ids);
        if (uniqueIds.size !== ids.length) {
          console.error('Duplicate IDs detected:', ids);
        }

        this.totalContacts = this.tableData.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contacts or customers:', err);
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

  handleSelectionChanged(event: any): void {
    console.log('Selection changed:', event);
    console.log('Selected keys:', event.selectedRowKeys);
    console.log('Selected data:', event.selectedRowsData);
    
    this.selectedContactIds = event.selectedRowKeys || [];
  }
    handleUpdate(event: any): void {
    const contactId = event.key;
    const finalData = { ...event.oldData, ...event.newData };

    const updatePayload = {
      firstName: finalData.name.split(' ')[0],
      lastName: finalData.name.split(' ').slice(1).join(' '),
      designation: finalData.designation,
      email: finalData.email,
      phoneNumber: finalData.phone,
      // Convert the status string from the dropdown back to the required boolean
      isActive: finalData.status === 'Active',
      // updatedBy: 3 // Hardcoded user ID
    };

    this.contactService.updateContact(contactId, updatePayload).subscribe({
      next: (response) => {
        console.log('Contact updated successfully', response);
        const index = this.tableData.findIndex(c => c.id === contactId);
        if (index !== -1) {
          this.tableData[index] = finalData;
          this.tableData = [...this.tableData];
        }
        
      },
      error: (err) => {
        console.error('Failed to update contact', err);
        this.loadContacts(); 
      }
    });
  }
 
  handleDelete(event: any): void {
    const contactId = event.key;

    if (confirm('Are you sure you want to delete this contact?')) {
      // No longer need to pass a userId
      this.contactService.deleteContact(contactId).subscribe({
        next: () => {
          console.log('Contact deleted successfully');
          this.tableData = this.tableData.filter(c => c.id !== contactId);
          this.totalContacts = this.tableData.length;
        },
        error: (err) => {
          console.error('Failed to delete contact', err);
          alert(err.error?.message || 'Could not delete the contact. Please try again.');
        }
      });
    }
  }

 


  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}