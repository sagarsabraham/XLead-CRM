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
import { DxBoxModule, DxButtonModule } from 'devextreme-angular';
import { ButtonComponent } from '../shared/button/button.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DealbodyComponent,
    DealcardComponent,
    DealheaderComponent,
    DealfooterComponent,
    PipelinepageComponent,
    TopcardComponent
  ],
  imports: [
    CommonModule,
    PipelineRoutingModule,
    DxButtonModule,
    DxBoxModule,
    DragDropModule,
    SharedModule
  ],
  exports: [
    
    PipelinepageComponent,  
  ]

})
export class PipelineModule { }
