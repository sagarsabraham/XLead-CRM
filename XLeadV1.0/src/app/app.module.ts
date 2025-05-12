import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { DevExtremeModule } from 'devextreme-angular';
import { DxButtonModule, DxBoxModule } from 'devextreme-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { PipelineModule } from './pipeline/pipeline.module';
import { SharedModule } from './shared/shared.module';
import { DxDataGridModule, DxTextBoxModule} from 'devextreme-angular';
import { ContactsModule } from './contacts/contacts.module';
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
    RouterModule, 
    DevExtremeModule,
    DxButtonModule,
    DxBoxModule,
    DragDropModule, 
    CommonModule,
    PipelineModule ,
    SharedModule,
    DxDataGridModule,
    DxTextBoxModule,
    ContactsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
 
})
export class AppModule { }