import { Component, HostListener, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import { IndustryVerticalService } from 'src/app/services/industry-vertical.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  tableHeaders = [
    { dataField: 'customerName', caption: 'Customer Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'website', caption: 'Website', visible: true },
    { dataField: 'industryVertical', caption: 'Industry Vertical', visible: true },
    { dataField: 'status', caption: 'Status', visible: true },
    // { dataField: 'owner', caption: 'Owner', visible: true }
  ];

  tableData: any[] = [];
  topcardData = [
    { amount: 0, title: 'Total Customers', icon: 'assets/count.svg' },
    { amount: 0, title: 'Active Customers', icon: 'assets/company.svg' },
    { amount: 0, title: 'Inactive Customers', icon: 'assets/company.svg' }
  ];

  totalCompanies = 0;
  isMobile: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  private industryVerticalMap: { [id: number]: string } = {}; // Will be populated dynamically
  private users: any[] = [];

  constructor(
    private companyService: CompanyContactService,
    private userService: UserService,
    private industryVerticalService: IndustryVerticalService // Added service
  ) {
    this.checkIfMobile();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    // Fetch industry verticals, users, and companies
    forkJoin({
      industryVerticals: this.industryVerticalService.getIndustryVertical(),
      users: this.userService.getUsers()
    }).subscribe({
      next: ({ industryVerticals, users }) => {
        console.log('Industry Verticals loaded:', industryVerticals);
        console.log('Users loaded:', users);

        // Map industry verticals
        this.industryVerticalMap = industryVerticals.reduce((map: { [id: number]: string }, vertical: any) => {
          map[vertical.id] = vertical.industryName || 'Unknown';
          return map;
        }, {});

        this.users = users;
        this.loadCompanies();
      },
      error: (err) => {
        console.error('Error loading industry verticals or users:', err);
        // Fallback: Load companies even if industry verticals or users fail
        this.industryVerticalMap = {}; // Empty map as fallback
        this.users = [];
        this.loadCompanies();
      }
    });
  }
  
  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        console.log('Companies data:', companies);
    
        if (companies.length > 0) {
          console.log('Sample company:', companies[0]);
          console.log('createdBy value:', companies[0].createdBy);
        }

        this.tableData = companies.map(company => this.mapCompanyData(company));
        this.updateMetrics();
        this.totalCompanies = this.tableData.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
        this.error = 'Failed to load companies. Please try again later.';
        this.isLoading = false;
        
        this.tableData = [
          {
            id: '1',
            customerName: 'Demo Company',
            phone: '123-456-7890',
            website: 'demo.com',
            industryVertical: 'Technology',
            owner: 'System',
            status: 'Active'
          }
        ];
        this.updateMetrics();
      }
    });
  }

  private mapCompanyData(company: any): any {
    console.log('Mapping company:', company);
    console.log('Available users:', this.users);
  
    const ownerId = company.createdBy || company.CreatedBy || company.createdById || company.userId;
    console.log('Looking for owner with ID:', ownerId);
  
    const ownerIdNum = parseInt(ownerId);
    let owner = null;
  
    if (!isNaN(ownerIdNum)) {
      owner = this.users.find(u => u.id === ownerIdNum);
      if (!owner) {
        owner = this.users.find(u => u.id.toString() === ownerId.toString());
      }
    }
  
    console.log('Found owner:', owner);
    const ownerName = owner ? owner.name : 'System';
  
    return {
      id: this.safeToString(company.id),
      customerName: company.customerName || 'Unnamed Customer',
      phone: company.customerPhoneNumber || '',
      website: company.website || '',
      industryVertical: this.industryVerticalMap[company.industryVerticalId] || 'Unknown', // Use dynamic map
      owner: ownerName,
      status: this.mapStatus(company),
    };
  }

  private safeToString(value: any): string {
    return value !== undefined && value !== null ? String(value) : '';
  }

  private mapStatus(company: any): string {
    if (typeof company.status === 'string') {
      return company.status;
    }
    return 'Unknown';
  }

  private updateMetrics(): void {
    const total = this.tableData.length;
    const active = this.tableData.filter(company => company.status === 'Active').length;
    const inactive = this.tableData.filter(company => company.status === 'Not Active' || company.status === 'Inactive').length;
    
    this.topcardData = [
      { amount: total, title: 'Total Customers', icon: 'assets/count.svg' },
      { amount: active, title: 'Active Customers', icon: 'assets/company.svg' },
      { amount: inactive, title: 'Inactive Customers', icon: 'assets/company.svg' }
    ];
  }
   private getIndustryIdByName(name: string): number | null {
    const entry = Object.entries(this.industryVerticalMap).find(([id, value]) => value === name);
    return entry ? parseInt(entry[0], 10) : null;
  }

   handleUpdate(event: any): void {
    const companyId = event.key;
    const updatedData = event.newData;

    // Construct the DTO payload for the backend API
    const updatePayload = {
      customerName: updatedData.customerName,
      phoneNo: updatedData.phone, // Map 'phone' from table back to 'phoneNo'
      website: updatedData.website,
      industryVerticalId: this.getIndustryIdByName(updatedData.industryVertical),
      isActive: updatedData.status === 'Active',
      
    };

    this.companyService.updateCompany(companyId, updatePayload).subscribe({
      next: (response) => {
        console.log('Company updated successfully', response);
        // Find the index of the item in our local array
        const index = this.tableData.findIndex(c => c.id === companyId);
        if (index !== -1) {
         
          this.tableData[index] = { ...this.tableData[index], ...updatedData };
          
          this.tableData = [...this.tableData];
        
          this.updateMetrics();
        }
      },
      error: (err) => {
        console.error('Failed to update company', err);
        alert('Failed to update company. Please check the console for details.');
       
      }
    });
  }


  

  handleDelete(event: any): void {
    const companyId = event.key;

    if (confirm('Are you sure you want to delete this company? ')) {
      
      this.companyService.deleteCompany(companyId).subscribe({
        next: () => {
          console.log('Company deleted successfully');
          this.tableData = this.tableData.filter(c => c.id !== companyId);
          this.updateMetrics();
        },
        error: (err) => {
          console.error('Failed to delete company', err);
          alert(err.error?.message || 'Could not delete the company. Please try again.');
        }
      });
    }
  }
  
  @HostListener('window:resize')
  onResize(): void {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 576;
  }

  getIconColor(index: number): string {
    switch (index) {
      case 0:
        return '#8a2be2'; 
      case 1:
        return '#28a745'; 
      case 2:
        return '#dc3545'; 
      default:
        return '#000000';
    }
  }
}