import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsTableComponent } from './shared/contacts-table/contacts-table.component';
import { HeadersearchComponent } from './shared/headersearch/headersearch.component';
import { TableOutlineComponent } from './shared/table-outline/table-outline.component';
import { DxDataGridModule, DxTextBoxModule, DxButtonModule } from 'devextreme-angular';
import { ExportComponent } from './export/export.component';
import { ContactPageComponent } from './contacts/contact-page/contact-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactPageComponent,
    ContactsTableComponent,
    HeadersearchComponent,
    ExportComponent,
    
    TableOutlineComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }