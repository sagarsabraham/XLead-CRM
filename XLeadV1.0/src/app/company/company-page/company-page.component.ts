import { Component } from '@angular/core';

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
    { dataField: 'owner', caption: 'Owner', visible: false, cellTemplate: 'ownerCellTemplate' },
    { dataField: 'industry', caption: 'Industry', visible: false }
  ];

  tableData = [
    { id: '1', companyName: 'Tech Corp', phone: '123-456-7890', website: 'techcorp.com', owner: 'Alice', industry: 'Technology' },
    { id: '2', companyName: 'Innovate Inc', phone: '234-567-8901', website: 'innovate.com', owner: 'Bob', industry: 'Technology' },
    { id: '3', companyName: 'NextGen Ltd', phone: '345-678-9012', website: 'nextgen.com', owner: 'Charlie', industry: 'Technology' }
  ];

  topcardData = [
    { amount: 3, title: 'Total Companies', icon: 'sorted' },
    { amount: 2, title: 'Open Pipelines', icon: 'sorted' },
    { amount: 1, title: 'Closed Pipelines', icon: 'sorted' }
  ];

  // Determine the icon color based on the card index
  getIconColor(index: number): string {
    switch (index) {
      case 0: // First card (Total Count of Companies)
        return '#8a2be2'; // Violet
      case 1: // Second card (Open Pipelines)
        return '#28a745'; // Green
      case 2: // Third card (Closed Pipelines)
        return '#007bff'; // Blue
      default:
        return '#000000'; // Default color (black)
    }
  }


}