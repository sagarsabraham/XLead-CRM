import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { TableComponent } from './table/table.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';

@NgModule({
  declarations: [
    TableComponent,
    TableOutlineComponent
  ],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule
  ],
  exports: [
    TableComponent,
    TableOutlineComponent
  ]
})
export class SharedModule { }