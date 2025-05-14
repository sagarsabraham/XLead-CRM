import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { DevExtremeModule } from 'devextreme-angular';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { DxButtonModule, DxBoxModule, DxFileUploaderModule, DxPopupModule, DxFormModule, DxDateBoxModule, DxNumberBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { PipelineModule } from './pipeline/pipeline.module';
import { SharedModule } from './shared/shared.module';
import { DealInfoModule } from './deal-info/deal-info.module';
import { DxDataGridModule, DxTextBoxModule} from 'devextreme-angular';
import { ContactsModule } from './contacts/contacts.module';


@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxButtonModule,
    RouterModule,
    DevExtremeModule,
    DxBoxModule,
    DragDropModule, 
    CommonModule,
    PipelineModule ,
    SharedModule,
    DxDataGridModule,
    DxTextBoxModule,
    ContactsModule
  ],


// const routes: Routes = [
//   { path: 'contacts', component: ContactsComponent },
//   { path: 'companies', component: CompaniesComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
// ];

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }