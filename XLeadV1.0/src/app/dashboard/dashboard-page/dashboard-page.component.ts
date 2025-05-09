import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent {

  revenueData = [
    { month: 'April 2024', amount: 34567 },
    { month: 'April 2025', amount: 123457 },
    { month: 'May 2025', amount: 456786 },
    { month: 'June 2025', amount: 567190 }
    
  ];
  companyData=[
    {Account:'Harley Davidson',revenue:5000},
    {Account:'Kim Group',revenue:4500},
    {Account:'Java Co',revenue:2000}
    
  ];

}
