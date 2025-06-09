import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CompanyContactService, ContactUpdatePayload } from 'src/app/services/company-contact.service';


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
    { dataField: 'customerName', caption: 'Customer', visible: true },
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
  currentUserId: number;
  canGloballyEdit: boolean = false;
  canGloballyDelete: boolean = false;
  isViewingOwnData: boolean = true;
  
  selectedContactIds: string[] = []; 


  constructor(
    private contactService: CompanyContactService,
    private authService: AuthServiceService
  ) {
    this.currentUserId = this.authService.getUserId();
    this.checkIfMobile();
  }

  ngOnInit(): void {
    if (!this.currentUserId) {
      this.error = "User context not available. Cannot load contacts.";
      this.isLoading = false;
      console.error(this.error);
      return;
    }
    this.determinePermissions();
    this.loadContactsAndCustomers();
  }

  determinePermissions(): void {
    
    const hasViewTeamContacts = this.authService.hasPrivilege('ViewTeamContacts');

    if (hasViewTeamContacts) {
     
      this.canGloballyEdit = this.authService.hasPrivilege('EditAnyContact'); 
      this.canGloballyDelete = this.authService.hasPrivilege('DeleteAnyContact'); 
      this.isViewingOwnData = false;
    } else {
      
      this.canGloballyEdit = this.authService.hasPrivilege('EditOwnContact'); 
      this.canGloballyDelete = this.authService.hasPrivilege('DeleteOwnContact'); 
    }
    console.log(`Contact Page Permissions - Edit: ${this.canGloballyEdit}, Delete: ${this.canGloballyDelete}, IsOwnDataView: ${this.isViewingOwnData}`);
  }

  private safeToString(value: any): string {
    return value !== undefined && value !== null ? String(value) : '';
  }

  loadContactsAndCustomers(): void { 
    this.isLoading = true;
    this.error = null;

    if (!this.currentUserId) {
        this.error = "User ID not available for loading data.";
        this.isLoading = false;
        return;
    }

    forkJoin({
      contacts: this.contactService.getContacts(this.currentUserId),
      customers: this.contactService.getCompanies(this.currentUserId)
    }).subscribe({
      next: ({ contacts, customers }) => {
        const customerMap: { [id: number]: string } = {};
        customers.forEach((customer: any) => {
          customerMap[customer.id] = customer.customerName || 'Unknown Customer';
        });

        this.tableData = contacts.map(contact => ({
          id: this.safeToString(contact.id || `temp-id-${Math.random().toString(36).substring(2)}`),
          name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed Contact',
          phone: contact.phoneNumber || '',
          email: contact.email || '',
          customerName: contact.customerId ? (customerMap[contact.customerId] || `Cust. ID: ${contact.customerId}`) : 'No Customer Assigned',
          designation: contact.designation || 'N/A',
          status: contact.isActive ? 'Active' : 'Inactive',
        }));

        this.totalContacts = this.tableData.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contacts or customers:', err);
        this.error = err.message || 'Failed to load data. Please try again later.';
        this.isLoading = false;
      }
    });
  }
private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 576;
  }
  handleUpdate(event: any): void {
    const contactId = event.key;
    const finalData = { ...event.oldData, ...event.newData };

    // Construct the payload matching the ContactUpdatePayload interface
    const updatePayload: ContactUpdatePayload = {
      firstName: finalData.name.split(' ')[0] || '', // Ensure default for empty string
      lastName: finalData.name.split(' ').slice(1).join(' ') || null,
      designation: finalData.designation || null,
      email: finalData.email,
      phoneNumber: finalData.phone || null,
      isActive: finalData.status === 'Active',
      UpdatedBy: this.currentUserId // Use currentUserId
    };

    this.contactService.updateContact(contactId, updatePayload).subscribe({
      next: (response) => {
        console.log('Contact updated successfully', response);
        const index = this.tableData.findIndex(c => c.id === contactId);
        if (index !== -1) {
          // Update the local tableData with the data that was sent for update,
          // or ideally, re-fetch the single updated record or reload the list
          // For simplicity, updating with finalData which came from the grid
          this.tableData[index] = {
            ...this.tableData[index], // keep existing non-editable fields if any
            name: `${updatePayload.firstName} ${updatePayload.lastName || ''}`.trim(),
            phone: updatePayload.phoneNumber,
            email: updatePayload.email,
            designation: updatePayload.designation,
            status: updatePayload.isActive ? 'Active' : 'Inactive',
          };
          this.tableData = [...this.tableData]; // Trigger change detection for the grid
        }
      },
      error: (err) => {
        console.error('Failed to update contact', err);
        this.loadContactsAndCustomers(); // Reload data on error
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