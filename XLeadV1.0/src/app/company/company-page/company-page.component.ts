import { Component, HostListener, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  tableHeaders = [
    { dataField: 'companyName', caption: 'Customer Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'website', caption: 'Website', visible: true },
    { dataField: 'status', caption: 'Status', visible: true }
    // Keep other headers as needed
  ];

  tableData: any[] = [];
  topcardData = [
    { amount: 0, title: 'Total Customers', icon: 'sorted' },
    { amount: 0, title: 'Active Customers', icon: 'sorted' },
    { amount: 0, title: 'Inactive Customers', icon: 'sorted' }
  ];

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
    
    this.userService.getUsers().subscribe({
      next: (users) => {
         console.log('Users loaded:', users);
        this.users = users;
        this.loadCompanies();
      },
      error: (err) => {
        console.error('Error loading users:', err);
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

  private users: any[] = [];

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
  // const ownerName = owner ? owner.name : 'System';
  
  return {
    id: this.safeToString(company.id),
    companyName: company.companyName || 'Unnamed Company',
    phone: company.companyPhoneNumber || '',
    website: company.website || '',
    // owner: ownerName,
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
    
    if (company.isActive === true || company.isActive === 1) {
      return 'Active';
    } else if (company.isActive === false || company.isActive === 0) {
      return 'Not Active';
    }
    
    return 'Unknown';
  }

  private updateMetrics(): void {
    const total = this.tableData.length;
    
    const active = this.tableData.filter(company => 
      company.status === 'Active'
    ).length;
    
    const inactive = this.tableData.filter(company => 
      company.status === 'Not Active' || company.status === 'Inactive'
    ).length;
    
    this.topcardData = [
      { amount: total, title: 'Total Customers',icon: 'assets/count.svg'},
      { amount: active, title: 'Active Customers', icon: 'assets/company.svg' },
      { amount: inactive, title: 'Inactive Customers', icon: 'assets/company.svg' }
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