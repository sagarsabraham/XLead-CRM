import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineRoutingModule } from './pipeline-routing.module';
import { DealbodyComponent } from './dealbody/dealbody.component';
import { DealcardComponent } from './dealcard/dealcard.component';
import { DealheaderComponent } from './dealheader/dealheader.component';
import { DealfooterComponent } from './dealfooter/dealfooter.component';
import { PipelinepageComponent } from './pipelinepage/pipelinepage.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DxBoxModule, DxButtonModule, DxDateBoxModule, DxFileUploaderModule, DxFormModule, DxListModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule, DxSwitchModule } from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { AddDealModalComponent } from './add-deal-modal/add-deal-modal.component';
import { ModalHeaderComponent } from './modal-header/modal-header.component'
import { FormsModule } from '@angular/forms';
import { FormModalComponent } from './form-modal/form-modal.component';
import { ModalButtonsComponent } from './modal-buttons/modal-buttons.component';
import { DealInfoModule } from '../deal-info/deal-info.module';


@NgModule({
  declarations: [
    DealbodyComponent,
    DealcardComponent,
    DealheaderComponent,
    DealfooterComponent,
    PipelinepageComponent,
    AddDealModalComponent,
    ModalHeaderComponent,
    FormModalComponent,
    ModalButtonsComponent
   
  ],
  imports: [
    DxListModule,
    CommonModule,
    PipelineRoutingModule,
    DxButtonModule,
    FormsModule,
    DxBoxModule,
    DragDropModule,
    SharedModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxFormModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DealInfoModule,
    DxSwitchModule
  ],
  exports: [
    PipelinepageComponent 
  ]

})
export class PipelineModule { }