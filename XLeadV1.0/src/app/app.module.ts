import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TableOutlineComponent } from './shared/table-outline/table-outline.component';
import { ContactsTableComponent } from './shared/contacts-table/contacts-table.component';
import { ContactPageComponent } from './contacts/contact-page/contact-page.component';

// Define routes
const routes: Routes = [
  { path: 'contact', component: ContactPageComponent },
  { path: '', redirectTo: '/contact', pathMatch: 'full' },
  { path: '**', redirectTo: '/contact' }
];

@NgModule({
  declarations: [
    AppComponent,
    ContactPageComponent,
    TableOutlineComponent,
    ContactsTableComponent
  ],
  imports: [
    BrowserModule,
    DxDataGridModule,
    RouterModule.forRoot(routes),
    DxButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }