import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

import { UserService } from '../../services/user.service';
import { CompanyContactService } from 'src/app/services/company-contact.service';
import { IndustryVerticalService } from 'src/app/services/industry-vertical.service';
import { TableComponent } from 'src/app/shared/table/table.component'; // Assuming this is the correct path

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  @ViewChild('appTable') tableComponent!: TableComponent;

  // tableHeaders is now initialized by a dedicated method
  tableHeaders: any[] = []; 

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

  private industryVerticalMap: { [id: number]: string } = {};
  private allIndustryVerticals: { id: number; industryName: string }[] = []; // To store data for the dropdown
  private users: any[] = [];

  constructor(
    private companyService: CompanyContactService,
    private userService: UserService,
    private industryVerticalService: IndustryVerticalService
  ) {
    this.checkIfMobile();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    forkJoin({
      industryVerticals: this.industryVerticalService.getIndustryVertical(),
      users: this.userService.getUsers()
    }).subscribe({
      next: ({ industryVerticals, users }) => {
        this.allIndustryVerticals = industryVerticals; // Store the full array
        this.industryVerticalMap = industryVerticals.reduce((map: { [id: number]: string }, vertical: any) => {
          map[vertical.id] = vertical.industryName || 'Unknown';
          return map;
        }, {});
        
        this.initializeTableHeaders(); // Define headers now that we have the data
        
        this.users = users;
        this.loadCompanies();
      },
      error: (err) => {
        console.error('Error loading industry verticals or users:', err);
        this.initializeTableHeaders(); // Still init headers, dropdown will be empty
        this.users = [];
        this.loadCompanies();
      }
    });
  }

  // NEW METHOD to set up the table headers dynamically
  initializeTableHeaders(): void {
    this.tableHeaders = [
      { dataField: 'customerName', caption: 'Customer Name', visible: true },
      { dataField: 'phone', caption: 'Phone', visible: true },
      { dataField: 'website', caption: 'Website', visible: true },
      { 
        dataField: 'industryVertical', 
        caption: 'Industry Vertical', 
        visible: true,
        // This configures the dropdown for the 'industryVertical' column
        lookup: {
          dataSource: this.allIndustryVerticals,
          valueExpr: 'industryName',
          displayExpr: 'industryName'
        }
      },
      { 
        dataField: 'status', 
        caption: 'Status', 
        visible: true,
        lookup: {
          dataSource: [
            { value: 'Active' },
            { value: 'Inactive' }
          ],
          valueExpr: 'value',
          displayExpr: 'value'
        }
      },
    ];
  }
  
  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.tableData = companies.map(company => this.mapCompanyData(company));
        this.updateMetrics();
        this.totalCompanies = this.tableData.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
        this.error = 'Failed to load companies. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private mapCompanyData(company: any): any {
    const ownerId = company.createdBy || company.CreatedBy || company.createdById || company.userId;
    const owner = this.users.find(u => u.id === parseInt(ownerId)) || null;
    const ownerName = owner ? owner.name : 'System';
  
    return {
      id: this.safeToString(company.id),
      customerName: company.customerName || 'Unnamed Customer',
      phone: company.customerPhoneNumber  || '', // Corrected from your provided code
      website: company.website || '',
      industryVertical: this.industryVerticalMap[company.industryVerticalId] || 'Unknown',
      owner: ownerName,
      status: company.isActive ? 'Active' : 'Inactive', // Corrected from your provided code
      // Store original ID for lookups
      industryVerticalId: company.industryVerticalId 
    };
  }

  private safeToString(value: any): string {
    return value !== undefined && value !== null ? String(value) : '';
  }
  
  // This mapStatus method is no longer needed as it's handled in mapCompanyData
  // private mapStatus(company: any): string { ... }

  private updateMetrics(): void {
    const total = this.tableData.length;
    const active = this.tableData.filter(company => company.status === 'Active').length;
    const inactive = total - active;
    
    this.topcardData = [
      { amount: total, title: 'Total Customers', icon: 'assets/count.svg' },
      { amount: active, title: 'Active Customers', icon: 'assets/company.svg' },
      { amount: inactive, title: 'Inactive Customers', icon: 'assets/company.svg' }
    ];
  }

  // CORRECTED helper method to find the ID from the name
  private getIndustryIdByName(name: string): number | null {
    const vertical = this.allIndustryVerticals.find(v => v.industryName === name);
    return vertical ? vertical.id : null;
  }

  handleUpdate(event: any): void {
    const companyId = event.key;
    const finalData = { ...event.oldData, ...event.newData };

    const updatePayload = {
      customerName: finalData.customerName,
      phoneNo: finalData.phone,
      website: finalData.website,
      industryVerticalId: this.getIndustryIdByName(finalData.industryVertical),
      isActive: finalData.status === 'Active',
      updatedBy: 3 
    };

    // Check if industryVerticalId was found
    if (finalData.industryVertical && updatePayload.industryVerticalId === null) {
      alert(`Could not find an ID for the selected industry vertical: "${finalData.industryVertical}". Update cancelled.`);
      return;
    }

    this.companyService.updateCompany(companyId, updatePayload).subscribe({
      next: (response) => {
        console.log('Company updated successfully', response);
        const index = this.tableData.findIndex(c => c.id === companyId);
        if (index !== -1) {
          this.tableData[index] = { ...this.tableData[index], ...finalData };
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
    const userId = 3; // The backend requires a userId for soft delete

    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(companyId).subscribe({ // Pass the userId
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