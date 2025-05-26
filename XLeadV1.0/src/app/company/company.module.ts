import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyPageComponent } from './company-page/company-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CompanyPageComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule
  ]
})
export class CompanyModule { }