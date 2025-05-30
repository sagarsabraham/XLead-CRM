import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipelineOverviewRoutingModule } from './pipeline-overview-routing.module';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    OverviewPageComponent
  ],
  imports: [
    CommonModule,
    PipelineOverviewRoutingModule,SharedModule
  ]
})
export class PipelineOverviewModule { }