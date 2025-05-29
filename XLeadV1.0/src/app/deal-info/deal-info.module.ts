import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealInfoRoutingModule } from './deal-info-routing.module';
import { DealinfopageComponent } from './dealinfopage/dealinfopage.component';
import { DealHeaderComponent } from './deal-header/deal-header.component';
import { DxButtonModule, DxFormModule, DxPopupModule, DxSelectBoxModule, DxDateBoxModule, DxFileUploaderModule, DxListModule, DxTextBoxModule } from 'devextreme-angular';
import { StatusTimelineComponent } from './status-timeline/status-timeline.component';
import { RelatedInfoComponent } from './related-info/related-info.component';
import { DescriptionComponent } from './description/description.component';
import { HistoryTimelineComponent } from './history-timeline/history-timeline.component';
import { DealInfoCardComponent } from './deal-info-card/deal-info-card.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DealinfopageComponent,
    DealHeaderComponent,
    StatusTimelineComponent,
    RelatedInfoComponent,
    DescriptionComponent,
    HistoryTimelineComponent,
    DealInfoCardComponent
  ],
  imports: [
    SharedModule,
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
