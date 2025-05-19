import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevExtremeModule, DxBoxModule, DxButtonModule, DxDateBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import {  DxChartModule, DxDataGridModule } from 'devextreme-angular';
import { DevExtremeModule, DxDataGridModule, DxBoxModule, DxButtonModule, DxChartModule, DxDateBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxResponsiveBoxModule, DxScrollViewModule, DxSelectBoxModule } from 'devextreme-angular';
import { ButtonComponent } from './button/button.component';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { MetricCardOutlineComponent } from './metric-card-outline/metric-card-outline.component';
import { PipelineStageGraphComponent } from './pipeline-stage-graph/pipeline-stage-graph.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';
import { TableComponent } from './table/table.component';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { TopcardComponent } from './topcard/topcard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    TopcardComponent,
    PageNotFoundComponent,
    ButtonComponent,
    MetricCardComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    TableComponent,
    TableOutlineComponent,
    TopcardComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    DevExtremeModule,
    DxBoxModule,  
    DxFileUploaderModule,
    DxPopupModule,
    DxFormModule,
    DxNumberBoxModule,    
    DxSelectBoxModule,    
    DxDateBoxModule, 
    DxDateBoxModule,
    DxChartModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
    DxButtonModule,
    // RouterModule, 
    DxChartModule,  
    DxoExportModule,DxDataGridModule
    DxBoxModule,
    DxoExportModule,
    DxDataGridModule

  ],
  exports: [
    ButtonComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    TableComponent,
    TableOutlineComponent,
    TopcardComponent,
    PageNotFoundComponent
  ],

   schemas: [CUSTOM_ELEMENTS_SCHEMA]
 
})
export class SharedModule { }