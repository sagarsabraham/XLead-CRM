import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DxButtonModule, DxChartModule, DxDataGridModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './button/button.component';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { MetricCardOutlineComponent } from './metric-card-outline/metric-card-outline.component';
import { PipelineStageGraphComponent } from './pipeline-stage-graph/pipeline-stage-graph.component';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';
import { DxoExportModule } from 'devextreme-angular/ui/nested';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    ButtonComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    ContactsTableComponent,TableOutlineComponent
  ],
  imports: [
    CommonModule,
    DxButtonModule,
    RouterModule, 
    DxChartModule,
    DxoExportModule,DxDataGridModule

  ],
  exports:[ButtonComponent,MetricCardComponent,MetricCardOutlineComponent,PipelineStageGraphComponent,ContactsTableComponent],

  
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }


