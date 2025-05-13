import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { MetricCardOutlineComponent } from './metric-card-outline/metric-card-outline.component';
import { PipelineStageGraphComponent } from './pipeline-stage-graph/pipeline-stage-graph.component';
import { DxButtonModule, DxChartModule, DxResponsiveBoxModule, DxScrollViewModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent
  ],




  imports: [
    CommonModule,
    DxChartModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
    DxButtonModule
   
  ],
  exports: [
    CommonModule,
    DxChartModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
  
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }