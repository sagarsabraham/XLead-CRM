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
  private allIndustryVerticals: { id: number; industryName: string }[] = [];
  private users: any[] = [];

  tableLookups: { [key: string]: any[] } = {};

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
        this.allIndustryVerticals = industryVerticals;
        this.industryVerticalMap = industryVerticals.reduce((map: { [id: number]: string }, vertical: any) => {
          map[vertical.id] = vertical.industryName || 'Unknown';
          return map;
        }, {});
        this.tableLookups = {
          industryVertical: this.allIndustryVerticals
        };
        
        this.initializeTableHeaders();
        
        this.users = users;
        this.loadCompanies();
      },
      error: (err) => {
        console.error('Error loading prerequisites:', err);
        this.initializeTableHeaders();
        this.users = [];
        this.loadCompanies();
      }
    });
  }

  initializeTableHeaders(): void {
    this.tableHeaders = [
      { dataField: 'customerName', caption: 'Customer Name', visible: true },
      { dataField: 'phone', caption: 'Phone', visible: true },
      { dataField: 'website', caption: 'Website', visible: true },
      { 
        dataField: 'industryVertical', 
        caption: 'Industry Vertical', 
        visible: true,
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
          dataSource: [ { value: 'Active' }, { value: 'Inactive' } ],
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
      phone: company.customerPhoneNumber  || '',
      website: company.website || '',
      industryVertical: this.industryVerticalMap[company.industryVerticalId] || 'Unknown',
      owner: ownerName,
      status: company.isActive ? 'Active' : 'Inactive',
      // Store the raw boolean for consistent re-mapping
      isActive: company.isActive,
      industryVerticalId: company.industryVerticalId 
    };
  }

  private safeToString(value: any): string {
    return value !== undefined && value !== null ? String(value) : '';
  }
  
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

  private getIndustryIdByName(name: string): number | null {
    const vertical = this.allIndustryVerticals.find(v => v.industryName === name);
    return vertical ? vertical.id : null;
  }

  // --- CORRECTED handleUpdate METHOD ---
  handleUpdate(event: any): void {
    const companyId = event.key;
    const finalData = { ...event.oldData, ...event.newData };

    // This is the correct boolean value to send to the backend.
    const newIsActiveValue = finalData.status === 'Active';

    const updatePayload = {
      customerName: finalData.customerName,
      phoneNo: finalData.phone,
      website: finalData.website,
      industryVerticalId: this.getIndustryIdByName(finalData.industryVertical),
      isActive: newIsActiveValue, // Use the calculated boolean
      updatedBy: 3 
    };

    if (finalData.industryVertical && updatePayload.industryVerticalId === null) {
      alert(`Could not find an ID for the selected industry vertical: "${finalData.industryVertical}". Update cancelled.`);
      return;
    }

    this.companyService.updateCompany(companyId, updatePayload).subscribe({
      next: (response) => {
        console.log('Company updated successfully', response);
        const index = this.tableData.findIndex(c => c.id === companyId);
        if (index !== -1) {
         
          finalData.isActive = newIsActiveValue; 

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

  // --- CORRECTED handleDelete METHOD ---
  handleDelete(event: any): void {
    const companyId = event.key;
    const userId = 3; 

    if (confirm('Are you sure you want to delete this company?')) {
      // Your backend soft-delete endpoint requires a userId
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
      case 0: return '#8a2be2'; 
      case 1: return '#28a745'; 
      case 2: return '#dc3545'; 
      default: return '#000000';
    }
  }
}