<<<<<<< HEAD
import { Component, HostListener, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { UserService } from '../../services/user.service';
 
=======
import { Component } from '@angular/core';
import { CompanyContactService } from 'src/app/services/company-contact.service';

>>>>>>> e487256fd5190cb47dbd610bdd8489de7ef1c118
@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
<<<<<<< HEAD
export class CompanyPageComponent implements OnInit {
  tableHeaders = [
    { dataField: 'companyName', caption: 'Company Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'website', caption: 'Website', visible: true },
    { dataField: 'owner', caption: 'Owner', visible: true, cellTemplate: 'ownerCellTemplate' },
    { dataField: 'status', caption: 'Status', visible: true }
    // Keep other headers as needed
  ];
 
  tableData: any[] = [];
=======
export class CompanyPageComponent {
   tableHeaders = [
    { dataField: 'companyName', caption: 'Company Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'website', caption: 'Website', visible: true },
    { dataField: 'status', caption: 'Status', visible: true },
    { dataField: 'industry', caption: 'Industry', visible: false }
  ];

  tableData: any[] = [];
  isLoading = true;
>>>>>>> e487256fd5190cb47dbd610bdd8489de7ef1c118
  topcardData = [
    { amount: 0, title: 'Total Companies', icon: 'sorted' },
    { amount: 0, title: 'Active Companies', icon: 'sorted' },
    { amount: 0, title: 'Inactive Companies', icon: 'sorted' }
  ];
<<<<<<< HEAD
 
  totalCompanies = 0;
  isMobile: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;
 
  constructor(private companyService: CompanyService, private userService: UserService) {
    this.checkIfMobile();
  }
 
  ngOnInit(): void {
   
     this.loadData();
   
  }
 
  loadData(): void {
    this.isLoading = true;
    this.error = null;
   
    // Load users first, then companies
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Store users for mapping
         console.log('Users loaded:', users);
        this.users = users;
       
        // Now load companies
        this.loadCompanies();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        // Still try to load companies even if users fail
        this.loadCompanies();
      }
    });
  }
 
  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        // Map API data with safe null checks
 
         console.log('Companies data:', companies);
   
    // Check if createdBy exists in the response
    if (companies.length > 0) {
      console.log('Sample company:', companies[0]);
      console.log('createdBy value:', companies[0].createdBy);
    }
        this.tableData = companies.map(company => this.mapCompanyData(company));
       
        // Update top card metrics
        this.updateMetrics();
       
        this.totalCompanies = this.tableData.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
        this.error = 'Failed to load companies. Please try again later.';
        this.isLoading = false;
       
        // Optional: Keep demo data for UI testing if API fails
        this.tableData = [
          {
            id: '1',
            companyName: 'Demo Company',
            phone: '123-456-7890',
            website: 'demo.com',
            owner: 'System',
            status: 'Active'
          }
        ];
        this.updateMetrics();
      }
    });
  }
 
  // Add users property
  private users: any[] = [];
 
private mapCompanyData(company: any): any {
  console.log('Mapping company:', company);
  console.log('Available users:', this.users);
 
  // Check different possible property names for created by
  const ownerId = company.createdBy || company.CreatedBy || company.createdById || company.userId;
  console.log('Looking for owner with ID:', ownerId);
 
  // Make sure comparison is done correctly (string vs number)
  const ownerIdNum = parseInt(ownerId);
  let owner = null;
 
  if (!isNaN(ownerIdNum)) {
    // Try to find by numeric ID first
    owner = this.users.find(u => u.id === ownerIdNum);
   
    // If not found, try string comparison
    if (!owner) {
      owner = this.users.find(u => u.id.toString() === ownerId.toString());
    }
  }
 
  console.log('Found owner:', owner);
  const ownerName = owner ? owner.name : 'System';
 
  return {
    id: this.safeToString(company.id),
    companyName: company.companyName || 'Unnamed Company',
    phone: company.companyPhoneNumber || '',
    website: company.website || '',
    owner: ownerName,
    status: this.mapStatus(company),
  };
}
 
  // Add the missing method
  private safeToString(value: any): string {
    return value !== undefined && value !== null ? String(value) : '';
  }
 
  private mapStatus(company: any): string {
    // If status is already a string (like 'Active' or 'Not Active')
    if (typeof company.status === 'string') {
      return company.status;
    }
   
    // If status is a boolean from isActive property
    if (company.isActive === true || company.isActive === 1) {
      return 'Active';
    } else if (company.isActive === false || company.isActive === 0) {
      return 'Not Active';
    }
   
    // If we can't determine, return unknown
    return 'Unknown';
  }
 
  private updateMetrics(): void {
    // Count total companies
    const total = this.tableData.length;
   
    // Count active and inactive companies - match both formats
    const active = this.tableData.filter(company =>
      company.status === 'Active'
    ).length;
   
    const inactive = this.tableData.filter(company =>
      company.status === 'Not Active' || company.status === 'Inactive'
    ).length;
   
    // Update top card data
    this.topcardData = [
      { amount: total, title: 'Total Companies', icon: 'sorted' },
      { amount: active, title: 'Active Companies', icon: 'sorted' },
      { amount: inactive, title: 'Inactive Companies', icon: 'sorted' }
    ];
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
        return '#8a2be2'; // Violet
      case 1:
        return '#28a745'; // Green
      case 2:
        return '#dc3545'; // Red
      default:
        return '#000000';
=======
  constructor(private companyContactService: CompanyContactService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.companyContactService.getCompanies().subscribe({
      next: (data) => {
        this.tableData = data.map((company: any) => ({
          id: company.id || company.companyId,
          companyName: company.companyName,
          phone: company.companyPhoneNumber || company.phone,
          website: company.website,
          status: company.isActive !== false ? 'Active' : 'Not Active',
          industry: company.industry || 'Technology' // Default if not provided
        }));
        
        // this.updateTopCardData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.isLoading = false;
      }
    });
  }

  // updateTopCardData(): void {
  //   const totalCompanies = this.tableData.length;
  //   const activeCompanies = this.tableData.filter(company => company.status === 'Active').length;
  //   const inactiveCompanies = totalCompanies - activeCompanies;

  //   this.topcardData = [
  //     { amount: totalCompanies, title: 'Total Companies', icon: 'sorted' },
  //     { amount: activeCompanies, title: 'Active Companies', icon: 'sorted' },
  //     { amount: inactiveCompanies, title: 'Inactive Companies', icon: 'sorted' }
  //   ];
  // }

  // Determine the icon color based on the card index
  getIconColor(index: number): string {
    switch (index) {
      case 0: // First card (Total Companies)
        return '#8a2be2'; // Violet
      case 1: // Second card (Active Companies)
        return '#28a745'; // Green
      case 2: // Third card (Inactive Companies)
        return '#dc3545'; // Red
      default:
        return '#000000'; // Default color (black)
>>>>>>> e487256fd5190cb47dbd610bdd8489de7ef1c118
    }
  }
}