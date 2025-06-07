import { Component } from '@angular/core';



@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],

})
export class DashboardPageComponent {
  revenueData = [
 
    { month: 'March 2024', amount: 14567890 },
    { month: 'January 2025', amount: 16885671 },
    { month: 'February 2025', amount: 1897190 },
     { month: 'March 2025', amount: 1897090 },
    { month: 'April 2024', amount: 1234567 },
    { month: 'April 2025', amount: 563457 },
    { month: 'May 2025', amount: 566786 },
    { month: 'June 2025', amount: 56567190 }
     
  ];

  companyData = [
    { Account: 'Harley Davidson', revenue: 5000 },
    { Account: 'Kim Group', revenue: 4500 },
    { Account: 'Java Co', revenue: 2000 },
    { Account: 'Java Co', revenue: 2000 },
    { Account: 'Java Co', revenue: 2000 },
    { Account: 'Java Co', revenue: 2000 },
    
  ];

  stages = [
    { stage: 'Qualification', amount: 3343874 },
    { stage: 'Needs Analysis', amount: 456711 },
    { stage: 'Proposal/Price Quote', amount: 241241 },
    { stage: 'Negotiation/Review', amount: 680000 }
  ];
}