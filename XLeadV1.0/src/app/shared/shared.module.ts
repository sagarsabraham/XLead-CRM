import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';

@NgModule({
  declarations: [
    ContactsTableComponent,
    TableOutlineComponent
  ],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule
  ],
  exports: [
    ContactsTableComponent,
    TableOutlineComponent
  ]
})
export class SharedModule { }