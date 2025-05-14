import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevExtremeModule, DxBoxModule, DxButtonModule, DxDateBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { IconComponent } from './icon/icon.component';
import { IconTextComponent } from './icon-text/icon-text.component';
import { ProfileComponent } from './profile/profile.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {  DxChartModule, DxDataGridModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './button/button.component';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { MetricCardOutlineComponent } from './metric-card-outline/metric-card-outline.component';
import { PipelineStageGraphComponent } from './pipeline-stage-graph/pipeline-stage-graph.component';
import { TableComponent } from './table/table.component';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { TopcardComponent } from './topcard/topcard.component';



@NgModule({
  declarations: [
    IconComponent,
    IconTextComponent,
    ProfileComponent,
    SidenavComponent,
    SidebarComponent,
    CheckboxComponent,
    TableOutlineComponent,
    PageNotFoundComponent,
    ButtonComponent,
    MetricCardComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    TableComponent,
    TableOutlineComponent,
    TopcardComponent,
    PageNotFoundComponent,
    TableComponent
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


  ],
  exports: [
    ButtonComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    TableComponent,
    TableOutlineComponent,
    TopcardComponent,
    PageNotFoundComponent,
    IconComponent,
    IconTextComponent,
    ProfileComponent,
    SidenavComponent,
    SidebarComponent,
    CheckboxComponent
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SharedModule { }


