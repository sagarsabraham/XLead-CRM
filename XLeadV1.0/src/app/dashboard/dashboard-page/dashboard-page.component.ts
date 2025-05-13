import { Component } from '@angular/core';
import { DxResponsiveBoxModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardModule } from '../dashboard.module';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],

})
export class DashboardPageComponent {
  revenueData = [
    { month: 'April 2024', amount: 34567 },
    { month: 'April 2025', amount: 123457 },
    { month: 'May 2025', amount: 456786 },
    { month: 'June 2025', amount: 567190 }
  ];

  companyData = [
    { Account: 'Harley Davidson', revenue: 5000 },
    { Account: 'Kim Group', revenue: 4500 },
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