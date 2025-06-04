import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealInfoRoutingModule } from './deal-info-routing.module';
import { DealinfopageComponent } from './dealinfopage/dealinfopage.component';
import { DealHeaderComponent } from './deal-header/deal-header.component';
import { DxButtonModule,
         DxFormModule, 
         DxPopupModule, 
         DxSelectBoxModule, 
         DxDateBoxModule, 
         DxFileUploaderModule, 
         DxListModule, 
         DxTextBoxModule, 
         DxTabsModule, 
         DxTextAreaComponent} from 'devextreme-angular';
import { StatusTimelineComponent } from './status-timeline/status-timeline.component';
import { RelatedInfoComponent } from './related-info/related-info.component';
import { DescriptionComponent } from './description/description.component';
import { HistoryTimelineComponent } from './history-timeline/history-timeline.component';
import { DealInfoCardComponent } from './deal-info-card/deal-info-card.component';
import { SharedModule } from '../shared/shared.module';
import { DocUploadComponent } from './doc-upload/doc-upload.component';
import { NotesTabComponent } from './notes-tab/notes-tab.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DealinfopageComponent,
    DealHeaderComponent,
    StatusTimelineComponent,
    RelatedInfoComponent,
    DescriptionComponent,
    HistoryTimelineComponent,
    DealInfoCardComponent,
    DocUploadComponent,NotesTabComponent
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
    DxTextBoxModule,
    DxTabsModule,FormsModule,
    DxButtonModule,
    DxListModule
  ],exports: [
    NotesTabComponent  // optional: only needed if used in other modules
  ]
})
export class DealInfoModule { }
