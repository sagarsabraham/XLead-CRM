import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { HeadersearchComponent } from './headersearch/headersearch.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';



@NgModule({
  declarations: [
    CheckboxComponent,
    ContactsTableComponent,
    HeadersearchComponent,
    TableOutlineComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
