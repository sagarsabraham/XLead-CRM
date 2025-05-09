import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineRoutingModule } from './pipeline-routing.module';
import { DealbodyComponent } from './dealbody/dealbody.component';
import { DealcardComponent } from './dealcard/dealcard.component';
import { DealheaderComponent } from './dealheader/dealheader.component';
import { DealfooterComponent } from './dealfooter/dealfooter.component';
import { PipelinepageComponent } from './pipelinepage/pipelinepage.component';
import { TopcardComponent } from './topcard/topcard.component';
import { DxBoxModule, DxButtonModule } from 'devextreme-angular';


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
    PipelineRoutingModule,DxButtonModule,DxBoxModule
  ],
  exports:[PipelinepageComponent]
})
export class PipelineModule { }
