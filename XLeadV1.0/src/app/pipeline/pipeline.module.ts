import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineRoutingModule } from './pipeline-routing.module';
import { DealbodyComponent } from './dealbody/dealbody.component';
import { DealcardComponent } from './dealcard/dealcard.component';
import { DealheaderComponent } from './dealheader/dealheader.component';
import { DealfooterComponent } from './dealfooter/dealfooter.component';
import { PipelinepageComponent } from './pipelinepage/pipelinepage.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DxBoxModule, DxButtonModule, DxDateBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { AddDealModalComponent } from './add-deal-modal/add-deal-modal.component';
import { TopcardComponent } from '../shared/topcard/topcard.component';


@NgModule({
  declarations: [
    DealbodyComponent,
    DealcardComponent,
    DealheaderComponent,
    DealfooterComponent,
    PipelinepageComponent,
    AddDealModalComponent
   
  ],
  imports: [
    CommonModule,
    PipelineRoutingModule,
    DxButtonModule,
    DxBoxModule,
    DragDropModule,
    SharedModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxFormModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule
  ],
  exports: [
    PipelinepageComponent 
  ]

})
export class PipelineModule { }