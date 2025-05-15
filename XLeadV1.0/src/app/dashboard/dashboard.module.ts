import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DxBoxModule, DxButtonModule, DxChartModule, DxResponsiveBoxModule, DxScrollViewModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { TopCompanyComponent } from './top-company/top-company.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RevenueChartComponent, DashboardPageComponent, TopCompanyComponent
  
  ],
  imports: [
   
    FormsModule,
    CommonModule,
    DashboardRoutingModule,
    DxChartModule,
    SharedModule,
    DxChartModule,
    DxScrollViewModule,
    DxBoxModule,
    DxResponsiveBoxModule,
    DxButtonModule
  ],
  exports:[DashboardPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
  
 }
