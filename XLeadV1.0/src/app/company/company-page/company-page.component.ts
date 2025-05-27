import { Component } from '@angular/core';
import { CompanyContactService } from 'src/app/services/company-contact.service';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent {
   tableHeaders = [
    { dataField: 'companyName', caption: 'Company Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'website', caption: 'Website', visible: true },
    { dataField: 'status', caption: 'Status', visible: true },
    { dataField: 'industry', caption: 'Industry', visible: false }
  ];

<<<<<<< HEAD
 tableData = [
  { id: '1', companyName: 'Tech Corp', phone: '123-456-7890', website: 'techcorp.com', owner: 'Alice', industry: 'Technology' },
  { id: '2', companyName: 'Innovate Inc', phone: '234-567-8901', website: 'innovate.com', owner: 'Bob', industry: 'Technology' },
  { id: '3', companyName: 'NextGen Ltd', phone: '345-678-9012', website: 'nextgen.com', owner: 'Charlie', industry: 'Technology' },
  { id: '4', companyName: 'Green Solutions', phone: '456-789-0123', website: 'greensolutions.org', owner: 'Dana', industry: 'Energy' },
  { id: '5', companyName: 'FinGrowth', phone: '567-890-1234', website: 'fingrowth.net', owner: 'Evan', industry: 'Finance' },
  { id: '6', companyName: 'HealthWorks', phone: '678-901-2345', website: 'healthworks.com', owner: 'Fiona', industry: 'Healthcare' },
  { id: '7', companyName: 'Bright Future', phone: '789-012-3456', website: 'brightfuture.ai', owner: 'George', industry: 'Education' },
  { id: '8', companyName: 'BuildRight', phone: '890-123-4567', website: 'buildright.co', owner: 'Hannah', industry: 'Construction' },
  { id: '9', companyName: 'Oceanic Ventures', phone: '901-234-5678', website: 'oceanicventures.com', owner: 'Ivan', industry: 'Shipping' },
  { id: '10', companyName: 'UrbanGrid', phone: '012-345-6789', website: 'urbangrid.io', owner: 'Jenna', industry: 'Real Estate' },
  { id: '11', companyName: 'MediPlus', phone: '321-654-0987', website: 'mediplus.com', owner: 'Kyle', industry: 'Pharmaceuticals' },
  { id: '12', companyName: 'AutoMotion', phone: '432-765-1098', website: 'automotion.tech', owner: 'Lily', industry: 'Automotive' },
  { id: '13', companyName: 'Cloudify', phone: '543-876-2109', website: 'cloudify.cloud', owner: 'Mark', industry: 'Cloud Services' },
  { id: '14', companyName: 'AgroGrow', phone: '654-987-3210', website: 'agrogrow.org', owner: 'Nina', industry: 'Agriculture' },
  { id: '15', companyName: 'TravelNest', phone: '765-098-4321', website: 'travelnest.com', owner: 'Oscar', industry: 'Hospitality' },
   { id: '1', companyName: 'Tech Corp', phone: '123-456-7890', website: 'techcorp.com', owner: 'Alice', industry: 'Technology' },
  { id: '2', companyName: 'Innovate Inc', phone: '234-567-8901', website: 'innovate.com', owner: 'Bob', industry: 'Technology' },
  { id: '3', companyName: 'NextGen Ltd', phone: '345-678-9012', website: 'nextgen.com', owner: 'Charlie', industry: 'Technology' },
  { id: '4', companyName: 'Green Solutions', phone: '456-789-0123', website: 'greensolutions.org', owner: 'Dana', industry: 'Energy' },
  { id: '5', companyName: 'FinGrowth', phone: '567-890-1234', website: 'fingrowth.net', owner: 'Evan', industry: 'Finance' },
  { id: '6', companyName: 'HealthWorks', phone: '678-901-2345', website: 'healthworks.com', owner: 'Fiona', industry: 'Healthcare' },
  { id: '7', companyName: 'Bright Future', phone: '789-012-3456', website: 'brightfuture.ai', owner: 'George', industry: 'Education' },
  { id: '8', companyName: 'BuildRight', phone: '890-123-4567', website: 'buildright.co', owner: 'Hannah', industry: 'Construction' },
  { id: '9', companyName: 'Oceanic Ventures', phone: '901-234-5678', website: 'oceanicventures.com', owner: 'Ivan', industry: 'Shipping' },
  { id: '10', companyName: 'UrbanGrid', phone: '012-345-6789', website: 'urbangrid.io', owner: 'Jenna', industry: 'Real Estate' },
  { id: '11', companyName: 'MediPlus', phone: '321-654-0987', website: 'mediplus.com', owner: 'Kyle', industry: 'Pharmaceuticals' },
  { id: '12', companyName: 'AutoMotion', phone: '432-765-1098', website: 'automotion.tech', owner: 'Lily', industry: 'Automotive' },
  { id: '13', companyName: 'Cloudify', phone: '543-876-2109', website: 'cloudify.cloud', owner: 'Mark', industry: 'Cloud Services' },
  { id: '14', companyName: 'AgroGrow', phone: '654-987-3210', website: 'agrogrow.org', owner: 'Nina', industry: 'Agriculture' },
  { id: '15', companyName: 'TravelNest', phone: '765-098-4321', website: 'travelnest.com', owner: 'Oscar', industry: 'Hospitality' }
];

=======
  tableData: any[] = [];
  isLoading = true;
>>>>>>> e487256fd5190cb47dbd610bdd8489de7ef1c118
  topcardData = [
    { amount: 3, title: 'Total Companies', icon: 'sorted' },
    { amount: 2, title: 'Open Pipelines', icon: 'sorted' },
    { amount: 1, title: 'Closed Pipelines', icon: 'sorted' }
  ];
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
    }
  }
}