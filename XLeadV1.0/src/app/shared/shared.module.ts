import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevExtremeModule } from 'devextreme-angular';
import { ButtonComponent } from './button/button.component';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { MetricCardOutlineComponent } from './metric-card-outline/metric-card-outline.component';
import { PipelineStageGraphComponent } from './pipeline-stage-graph/pipeline-stage-graph.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';
import { TableComponent } from './table/table.component';
import { TopcardComponent } from './topcard/topcard.component';

@NgModule({
  declarations: [
    ButtonComponent,
    MetricCardComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    TableComponent,
    TableOutlineComponent,
    TopcardComponent
  ],
  imports: [
    CommonModule,
    DevExtremeModule
  ],
  exports: [
    ButtonComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    TableComponent,
    TableOutlineComponent,
    TopcardComponent
  ]
  exports:[ButtonComponent,MetricCardComponent,MetricCardOutlineComponent,PipelineStageGraphComponent, PageNotFoundComponent],

  
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }