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
    { dataField: 'owner', caption: 'Owner', visible: true, cellTemplate: 'ownerCellTemplate' },
    { dataField: 'industry', caption: 'Industry', visible: true },
    { dataField: 'city', caption: 'City', visible: false },
    { dataField: 'state', caption: 'State', visible: false },
    { dataField: 'country', caption: 'Country', visible: false },
    { dataField: 'employees', caption: 'Employees', visible: false },
    { dataField: 'revenue', caption: 'Annual Revenue', visible: false },
    { dataField: 'founded', caption: 'Founded Year', visible: false },
    { dataField: 'status', caption: 'Status', visible: false }
  ];

  tableData = [
    {
      id: '1',
      companyName: 'Tech Corp',
      phone: '123-456-7890',
      website: 'techcorp.com',
      owner: 'Alice',
      industry: 'Technology',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      employees: 1200,
      revenue: '$50M',
      founded: 2010,
      status: 'Active'
    },
    {
      id: '2',
      companyName: 'Innovate Inc',
      phone: '234-567-8901',
      website: 'innovate.com',
      owner: 'Bob',
      industry: 'Technology',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      employees: 900,
      revenue: '$35M',
      founded: 2012,
      status: 'Active'
    },
    {
      id: '3',
      companyName: 'NextGen Ltd',
      phone: '345-678-9012',
      website: 'nextgen.com',
      owner: 'Charlie',
      industry: 'Technology',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      employees: 600,
      revenue: '$20M',
      founded: 2015,
      status: 'Inactive'
    },
    {
      id: '4',
      companyName: 'Green Solutions',
      phone: '456-789-0123',
      website: 'greensolutions.com',
      owner: 'Diana',
      industry: 'Environmental',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      employees: 350,
      revenue: '$12M',
      founded: 2013,
      status: 'Active'
    },
    {
      id: '5',
      companyName: 'FinEdge',
      phone: '567-890-1234',
      website: 'finedge.com',
      owner: 'Edward',
      industry: 'Finance',
      city: 'Newark',
      state: 'NJ',
      country: 'USA',
      employees: 1000,
      revenue: '$60M',
      founded: 2008,
      status: 'Active'
    },
    {
      id: '6',
      companyName: 'BuildRight',
      phone: '678-901-2345',
      website: 'buildright.com',
      owner: 'Fiona',
      industry: 'Construction',
      city: 'Dallas',
      state: 'TX',
      country: 'USA',
      employees: 750,
      revenue: '$40M',
      founded: 2011,
      status: 'Inactive'
    },
    {
      id: '7',
      companyName: 'MediHealth',
      phone: '789-012-3456',
      website: 'medihealth.com',
      owner: 'George',
      industry: 'Healthcare',
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      employees: 850,
      revenue: '$55M',
      founded: 2009,
      status: 'Active'
    },
    {
      id: '8',
      companyName: 'AgriCo',
      phone: '890-123-4567',
      website: 'agrico.com',
      owner: 'Hannah',
      industry: 'Agriculture',
      city: 'Des Moines',
      state: 'IA',
      country: 'USA',
      employees: 500,
      revenue: '$18M',
      founded: 2014,
      status: 'Active'
    },
    {
      id: '9',
      companyName: 'EduSmart',
      phone: '901-234-5678',
      website: 'edusmart.com',
      owner: 'Ian',
      industry: 'Education',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      employees: 300,
      revenue: '$10M',
      founded: 2016,
      status: 'Inactive'
    },
    {
      id: '10',
      companyName: 'LogiTrack',
      phone: '012-345-6789',
      website: 'logitrack.com',
      owner: 'Julia',
      industry: 'Logistics',
      city: 'Memphis',
      state: 'TN',
      country: 'USA',
      employees: 950,
      revenue: '$42M',
      founded: 2007,
      status: 'Active'
    }
  ];

  topcardData = [
    { amount: 10, title: 'Total Companies', icon: 'sorted' },
    { amount: 6, title: 'Active Companies', icon: 'sorted' },
    { amount: 4, title: 'Inactive Companies', icon: 'sorted' }
  ];

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
    }
  }
}
