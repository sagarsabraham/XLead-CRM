import { Component } from '@angular/core';
import { GridColumn } from '../../shared/table/table.interface';
 
@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent {
  tableHeaders: GridColumn[] = [
    {
      dataField: 'SalesPerson',
      caption: 'Salesperson',
      dataType: 'string',
      cellTemplate: 'ownerCellTemplate',
      visible: true,
      allowSorting: true,
      allowFiltering: true
    },
    {
      dataField: 'DealName',
      caption: 'Deal Name',
      dataType: 'string',
      visible: true,
      allowSorting: true,
      allowFiltering: true
    },
    {
      dataField: 'Stage',
      caption: 'Stage',
      dataType: 'string',
      visible: true,
      allowSorting: true,
      allowFiltering: true
    },
    {
      dataField: 'amount',
      caption: 'Amount',
      dataType: 'number',
      format: { type: 'currency', currency: 'USD', precision: 2 },
      visible: true, // Changed to true
      allowSorting: true, // Changed to true
      allowFiltering: true // Changed to true
    },
    {
      dataField: 'closingDate', // Changed to match data field
      caption: 'Closing Date',
      dataType: 'date',
      format: 'dd-MMM-yyyy',
      visible: true,
      allowSorting: true,
      allowFiltering: true
    }
  ];
 
  tableData = [
    { id: '1', SalesPerson: 'Alice Johnson', DealName: 'Enterprise Cloud Migration', Stage: 'Qualification', amount: 25000, closingDate: new Date('2021-06-30') },
    { id: '2', SalesPerson: 'Bob Smith', DealName: 'AI Analytics Suite', Stage: 'Needs Analysis', amount: 18000, closingDate: new Date('2021-07-01') },
    { id: '3', SalesPerson: 'Charlie Davis', DealName: 'E-commerce Platform', Stage: 'Proposal', amount: 32000, closingDate: new Date('2021-06-30') },
    { id: '4', SalesPerson: 'Dana White', DealName: 'Mobile App Revamp', Stage: 'Negotiation', amount: 27000, closingDate: new Date('2021-07-10') },
    { id: '5', SalesPerson: 'Eli Brown', DealName: 'CRM Integration', Stage: 'Closed Won', amount: 15000, closingDate: new Date('2021-05-20') },
    { id: '6', SalesPerson: 'Fiona Green', DealName: 'Custom ERP System', Stage: 'Proposal', amount: 40000, closingDate: new Date('2021-07-25') },
    { id: '7', SalesPerson: 'George King', DealName: 'Marketing Automation', Stage: 'Qualification', amount: 22000, closingDate: new Date('2021-06-18') },
    { id: '8', SalesPerson: 'Hannah Scott', DealName: 'Data Lake Setup', Stage: 'Needs Analysis', amount: 36000, closingDate: new Date('2021-06-28') },
    { id: '9', SalesPerson: 'Ian Black', DealName: 'SaaS Subscription Renewal', Stage: 'Closed Lost', amount: 10000, closingDate: new Date('2021-05-15') },
    { id: '10', SalesPerson: 'Julia Stone', DealName: 'Network Infrastructure Upgrade', Stage: 'Negotiation', amount: 30000, closingDate: new Date('2021-07-05') }
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
 