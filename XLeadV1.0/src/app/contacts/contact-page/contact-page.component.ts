import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import { DxToastComponent} from 'devextreme-angular';
 
@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  @ViewChild('toastInstance', { static: false }) toastInstance!: DxToastComponent;
  tableHeaders = [
    { dataField: 'name', caption: 'Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'email', caption: 'Email', visible: true },
    { dataField: 'customerName', caption: 'Customer', visible: true,
      allowEditing:false
     },
    { dataField: 'designation', caption: 'Designation', visible: true },
    {
      dataField: 'status',
      caption: 'Status',
      visible: true,
      
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
 canEditContacts = false;
  canDeleteContacts = false;

  toastMessage: string = '';
  toastType: 'info' | 'success' | 'error' | 'warning' = 'info';
  toastVisible: boolean = false;

  constructor(private contactService: CompanyContactService, private authService: AuthService) {
    this.checkIfMobile();
  }
 
  showToast(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
  }

  ngOnInit(): void {
    this.canEditContacts = this.authService.hasPrivilege('EditContact');
    this.canDeleteContacts = this.authService.hasPrivilege('DeleteContact');
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
          designation: contact.designation || 'N/A', 
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
      isActive: finalData.status === 'Active',
      updatedBy: this.authService.getUserId()
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
        this.showToast(err.error?.message || 'Update failed.', 'error');
        this.loadContacts(); 
      }
    });
  }

  
  handleDelete(event: any): void {
    const contactId = event.key;
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(contactId, this.authService.getUserId()).subscribe({
        next: () => {
          console.log('Contact deleted successfully');
          this.tableData = this.tableData.filter(c => c.id !== contactId);
          this.totalContacts = this.tableData.length;
        },
        error: (err) => {
          console.error('Failed to delete contact', err);
          this.showToast(err.error?.message || 'Could not delete the contact.', 'error');
        }
      });
    }
  }
 
  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
} 