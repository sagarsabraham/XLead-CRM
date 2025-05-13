import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealInfoRoutingModule } from './deal-info-routing.module';
import { DealinfopageComponent } from './dealinfopage/dealinfopage.component';
import { DealHeaderComponent } from './deal-header/deal-header.component';
import { DxButtonModule, DxFormModule, DxPopupModule, DxSelectBoxModule, DxDateBoxModule, DxFileUploaderModule, DxListModule, DxTextBoxModule } from 'devextreme-angular';
import { StatusTimelineComponent } from './status-timeline/status-timeline.component';


@NgModule({
  declarations: [
    DealinfopageComponent,
    DealHeaderComponent,
    StatusTimelineComponent
  ],
  imports: [
    CommonModule,
    DealInfoRoutingModule,
    DxButtonModule,
    DxFormModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DxListModule,
    DxTextBoxModule
  ]
})
export class DealInfoModule { }
