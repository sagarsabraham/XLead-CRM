import { Component, HostListener, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { UserService } from '../../services/user.service';
import { CompanyContactService, CustomerUpdatePayload } from 'src/app/services/company-contact.service';
import { IndustryVerticalService } from 'src/app/services/industry-vertical.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  currentUserId: number;
  canGloballyEdit: boolean = false;
canGloballyDelete: boolean = false;
isViewingOwnData: boolean = true;
  tableHeaders = [
    { dataField: 'customerName', caption: 'Customer Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'website', caption: 'Website', visible: true },
    { dataField: 'industryVertical', caption: 'Industry Vertical', visible: true },
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
    },
    
  ];
  

  tableData: any[] = [];
  topcardData = [
    { amount: 0, title: 'Total Customers', icon: 'assets/count.svg' },
    { amount: 0, title: 'Active Customers', icon: 'assets/company.svg' },
    { amount: 0, title: 'Inactive Customers', icon: 'assets/company.svg' }
  ];

  totalCompanies = 0;
  isMobile = false;
  isLoading = true;
  error: string | null = null;

  private industryVerticalMap: { [id: number]: string } = {};
  private users: any[] = [];

  constructor(
    private companyService: CompanyContactService,
    private userService: UserService,
    private industryVerticalService: IndustryVerticalService,
    private authService: AuthServiceService
  ) {
    this.currentUserId = this.authService.getUserId();
    this.checkIfMobile();
  }

  ngOnInit(): void {
    this.determinePermissions();
    if (!this.currentUserId) {
      this.error = 'User context not available. Cannot load companies.';
      this.isLoading = false;
      console.error(this.error);
      return;
    }
    this.loadData();
  }
determinePermissions(): void {
 
  const hasEditOwnCustomer = this.authService.hasPrivilege('EditOwnCustomer');
  const hasDeleteOwnCustomer = this.authService.hasPrivilege('DeleteOwnCustomer');
  
  
  const isManagerTeamView = this.authService.hasPrivilege('ViewTeamCustomers'); 

  if (isManagerTeamView) {
    this.canGloballyEdit = false; 
    this.canGloballyDelete = false;
    this.isViewingOwnData = false;
  } else {
   
    this.canGloballyEdit = hasEditOwnCustomer; 
    this.canGloballyDelete = hasDeleteOwnCustomer; 
    this.isViewingOwnData = true;
  }
  console.log(`Company Page Permissions - Edit: ${this.canGloballyEdit}, Delete: ${this.canGloballyDelete}, IsOwnDataView: ${this.isViewingOwnData}`);
}
  loadData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      industryVerticals: this.industryVerticalService.getIndustryVertical(),
      users: this.userService.getUsers(),
      companies: this.companyService.getCompanies(this.currentUserId)
    }).subscribe({
      next: ({ industryVerticals, users, companies }) => {
        this.industryVerticalMap = industryVerticals.reduce((map:{[id:number]:string}, vertical) => {
          
          map[vertical.id] = vertical.industryName || 'Unknown';
          return map;
        }, {});
        this.users = users;
        this.tableData = companies.map(c => this.mapCompanyData(c));
        this.updateMetrics();
        this.totalCompanies = this.tableData.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.error = err.message || 'Failed to load company data.';
        this.isLoading = false;
      }
    });
  }

  loadCompanies(): void {
    if (!this.currentUserId) {
      this.error = 'User ID not available.';
      return;
    }
    this.isLoading = true;
    this.companyService.getCompanies(this.currentUserId).subscribe({
      next: (companies) => {
        this.tableData = companies.map(c => this.mapCompanyData(c));
        this.updateMetrics();
        this.totalCompanies = this.tableData.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error refreshing companies:', err);
        this.error = err.message || 'Could not refresh companies.';
        this.isLoading = false;
      }
    });
  }

  private mapCompanyData(company: any): any {
    const owner = this.users.find(u => u.id === company.createdBy);
    const ownerName = owner ? owner.name : (company.createdBy ? `User ${company.createdBy}` : 'System');

    return {
      id: this.safeToString(company.id),
      customerName: company.customerName || 'Unnamed Customer',
      phone: company.customerPhoneNumber || '',
      website: company.website || '',
      industryVertical: this.industryVerticalMap[company.industryVerticalId] || 'Unknown',
      owner: ownerName,
      status: typeof company.status === 'string' ? company.status : 'Unknown'
    };
  }

  private safeToString(value: any): string {
    return value !== undefined && value !== null ? String(value) : '';
  }

  private updateMetrics(): void {
    const total = this.tableData.length;
    const active = this.tableData.filter(c => c.status === 'Active').length;
    const inactive = this.tableData.filter(c => ['Inactive', 'Not Active'].includes(c.status)).length;

    this.topcardData = [
      { amount: total, title: 'Total Customers', icon: 'assets/count.svg' },
      { amount: active, title: 'Active Customers', icon: 'assets/company.svg' },
      { amount: inactive, title: 'Inactive Customers', icon: 'assets/company.svg' }
    ];
  }

  private getIndustryIdByName(name: string): number | null {
    const entry = Object.entries(this.industryVerticalMap).find(([id, val]) => val === name);
    return entry ? parseInt(entry[0], 10) : null;
  }

  handleUpdate(event: any): void {
  const companyId = event.key;
  const finalData = { ...event.oldData, ...event.newData };

  const updatePayload: CustomerUpdatePayload = { 
    customerName: finalData.customerName,
    customerPhoneNumber: finalData.phone, 
    website: finalData.website,
    industryVerticalId: this.getIndustryIdByName(finalData.industryVertical),
    isActive: finalData.status === 'Active',
    UpdatedBy: this.currentUserId 
  };

  this.companyService.updateCompany(companyId, updatePayload).subscribe({ /* ... */ });
}

  handleDelete(event: any): void {
    const companyId = event.key;
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(companyId).subscribe({
        next: () => {
          this.tableData = this.tableData.filter(c => c.id !== companyId);
          this.updateMetrics();
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert(err.error?.message || 'Could not delete the company.');
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
      case 0: return '#8a2be2'; 
      case 1: return '#28a745'; 
      case 2: return '#dc3545'; 
      default: return '#000000';
    }
  }
}
