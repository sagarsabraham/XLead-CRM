import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineRoutingModule } from './pipeline-routing.module';
import { DealbodyComponent } from './dealbody/dealbody.component';
import { DealcardComponent } from './dealcard/dealcard.component';
import { DealheaderComponent } from './dealheader/dealheader.component';
import { DealfooterComponent } from './dealfooter/dealfooter.component';
import { PipelinepageComponent } from './pipelinepage/pipelinepage.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TopcardComponent } from './topcard/topcard.component';
import { DxBoxModule, DxButtonModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { AddDealModalComponent } from './add-deal-modal/add-deal-modal.component';


@NgModule({
  declarations: [
    DealbodyComponent,
    DealcardComponent,
    DealheaderComponent,
    DealfooterComponent,
    PipelinepageComponent,
    TopcardComponent,
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
    DxDateBoxModule
  ],
  exports: [
    PipelinepageComponent
  ]

})
export class PipelineModule { }
