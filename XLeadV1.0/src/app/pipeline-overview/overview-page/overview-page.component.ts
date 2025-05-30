import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent {
  tableHeaders = [
    { dataField: 'SalesPerson', caption: 'Salesperson', cellTemplate: 'ownerCellTemplate' },
    { dataField: 'DealName', caption: 'Deal Name' },
    { dataField: 'Stage', caption: 'Stage' },
    { 
      dataField: 'Amount', 
      caption: 'Amount', 
      dataType: 'number', 
      format: { type: 'currency', currency: 'USD' } 
    },
    { 
      dataField: 'ClosingDate', 
      caption: 'Closing Date', 
      dataType: 'date', 
      format: 'dd-MMM-yyyy' 
    }
  ];

  tableData = [
    { SalesPerson: 'Alice Johnson', DealName: 'Enterprise Cloud Migration', Stage: 'Qualification', Amount: 25000, ClosingDate: '2025-06-15' },
    { SalesPerson: 'Bob Smith', DealName: 'AI Analytics Suite', Stage: 'Needs Analysis', Amount: 18000, ClosingDate: '2025-07-01' },
    { SalesPerson: 'Charlie Davis', DealName: 'E-commerce Platform', Stage: 'Proposal', Amount: 32000, ClosingDate: '2025-06-30' },
    { SalesPerson: 'Dana White', DealName: 'Mobile App Revamp', Stage: 'Negotiation', Amount: 27000, ClosingDate: '2025-07-10' },
    { SalesPerson: 'Eli Brown', DealName: 'CRM Integration', Stage: 'Closed Won', Amount: 15000, ClosingDate: '2025-05-20' },
    { SalesPerson: 'Fiona Green', DealName: 'Custom ERP System', Stage: 'Proposal', Amount: 40000, ClosingDate: '2025-07-25' },
    { SalesPerson: 'George King', DealName: 'Marketing Automation', Stage: 'Qualification', Amount: 22000, ClosingDate: '2025-06-18' },
    { SalesPerson: 'Hannah Scott', DealName: 'Data Lake Setup', Stage: 'Needs Analysis', Amount: 36000, ClosingDate: '2025-06-28' },
    { SalesPerson: 'Ian Black', DealName: 'SaaS Subscription Renewal', Stage: 'Closed Lost', Amount: 10000, ClosingDate: '2025-05-15' },
    { SalesPerson: 'Julia Stone', DealName: 'Network Infrastructure Upgrade', Stage: 'Negotiation', Amount: 30000, ClosingDate: '2025-07-05' },
     { SalesPerson: 'Alice Johnson', DealName: 'Enterprise Cloud Migration', Stage: 'Qualification', Amount: 25000, ClosingDate: '2025-06-15' },
    { SalesPerson: 'Bob Smith', DealName: 'AI Analytics Suite', Stage: 'Needs Analysis', Amount: 18000, ClosingDate: '2025-07-01' },
    { SalesPerson: 'Charlie Davis', DealName: 'E-commerce Platform', Stage: 'Proposal', Amount: 32000, ClosingDate: '2025-06-30' },
    { SalesPerson: 'Dana White', DealName: 'Mobile App Revamp', Stage: 'Negotiation', Amount: 27000, ClosingDate: '2025-07-10' },
    { SalesPerson: 'Eli Brown', DealName: 'CRM Integration', Stage: 'Closed Won', Amount: 15000, ClosingDate: '2025-05-20' },
    { SalesPerson: 'Fiona Green', DealName: 'Custom ERP System', Stage: 'Proposal', Amount: 40000, ClosingDate: '2025-07-25' },
    { SalesPerson: 'George King', DealName: 'Marketing Automation', Stage: 'Qualification', Amount: 22000, ClosingDate: '2025-06-18' },
    { SalesPerson: 'Hannah Scott', DealName: 'Data Lake Setup', Stage: 'Needs Analysis', Amount: 36000, ClosingDate: '2025-06-28' },
    { SalesPerson: 'Ian Black', DealName: 'SaaS Subscription Renewal', Stage: 'Closed Lost', Amount: 10000, ClosingDate: '2025-05-15' },
    { SalesPerson: 'Julia Stone', DealName: 'Network Infrastructure Upgrade', Stage: 'Negotiation', Amount: 30000, ClosingDate: '2025-07-05' }
  ];

  topcardData = [
    { amount: 14, title: 'Qualification', icon: 'plus' },
    { amount: 5, title: 'Need Analysis', icon: 'doc' },
    { amount: 4, title: 'Proposal', icon: 'money' },
    { amount: 14, title: 'Negotiation', icon: 'overflow' },
    { amount: 14, title: 'Closed Won', icon: 'check' },
    { amount: 14, title: 'Closed Lost', icon: 'close' }
  ];

  getIconColor(index: number): string {
    switch (index) {
      case 0: return '#F8A978'; // Orange
      case 1: return '#92BEFA'; // Light blue
      case 2: return '#B0A3E2'; // Purple
      case 3: return '#D0D0D0'; // Grey
      case 4: return '#87DEB2'; // Green
      case 5: return '#F48F9F'; // Pink
      default: return '#000000';
    }
  }
}