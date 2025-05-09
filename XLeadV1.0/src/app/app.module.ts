import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DxDataGridModule, DxTextBoxModule, DxButtonModule } from 'devextreme-angular';
import { SharedModule } from './shared/shared.module';
import { ContactsModule } from './contacts/contacts.module';
import { PipelineModule } from './pipeline/pipeline.module';
// const routes: Routes = [
//   { path: 'contacts', component: ContactsComponent },
//   { path: 'companies', component: CompaniesComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
// ];

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxButtonModule,
    SharedModule,
    ContactsModule,
    PipelineModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }