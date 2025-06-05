
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevExtremeModule,
         DxBoxModule,
         DxDateBoxModule, 
         DxFileUploaderModule, 
         DxFormModule, 
         DxNumberBoxModule, 
         DxPopupModule, 
         DxSelectBoxModule, 
         DxDataGridModule, 
         DxButtonModule, 
         DxChartModule, 
         DxResponsiveBoxModule, 
         DxScrollViewModule } from 'devextreme-angular';
import { IconComponent } from './icon/icon.component';
import { IconTextComponent } from './icon-text/icon-text.component';
import { ProfileComponent } from './profile/profile.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ButtonComponent } from './button/button.component';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { MetricCardOutlineComponent } from './metric-card-outline/metric-card-outline.component';
import { PipelineStageGraphComponent } from './pipeline-stage-graph/pipeline-stage-graph.component';
import { TableComponent } from './table/table.component';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { TopcardComponent } from './topcard/topcard.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TopbarComponent } from './topbar/topbar.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IconComponent,
    IconTextComponent,
    ProfileComponent,
    SidebarComponent,
    CheckboxComponent,
    TableOutlineComponent,
    PageNotFoundComponent,
    TopcardComponent,
    PageNotFoundComponent,
    ButtonComponent,
    MetricCardComponent,
    MetricCardOutlineComponent,
    PipelineStageGraphComponent,
    TableComponent,
    TableOutlineComponent,
    TopcardComponent,
    PageNotFoundComponent,
    TableComponent,
    TopbarComponent,
    
  ],
  
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    DevExtremeModule,
    DxBoxModule,  
    DxBoxModule,  
    DxFileUploaderModule,
    DxPopupModule,
    DxFormModule,
    DxNumberBoxModule,    
    DxSelectBoxModule,    
    DxDateBoxModule,
    RouterModule,
    DxChartModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
    DxButtonModule,
    DxBoxModule,
    DxoExportModule,
    DxDataGridModule,
    FormsModule,

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
    SidebarComponent,
    CheckboxComponent,
    TopbarComponent
  ],

   schemas: [CUSTOM_ELEMENTS_SCHEMA]
 
})

export class SharedModule { }


