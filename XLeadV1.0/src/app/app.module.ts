// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { AppRoutingModule } from './app-routing.module';
// import { DevExtremeModule } from 'devextreme-angular';
// import { AppComponent } from './app.component';
// import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
// import { RouterModule } from '@angular/router';
// import { DxButtonModule, DxBoxModule, DxFileUploaderModule, DxPopupModule, DxFormModule, DxDateBoxModule, DxNumberBoxModule, DxSelectBoxModule } from 'devextreme-angular';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { CommonModule } from '@angular/common';
// import { PipelineModule } from './pipeline/pipeline.module';
// import { SharedModule } from './shared/shared.module';
// import { DealInfoModule } from './deal-info/deal-info.module';
// import { DxDataGridModule, DxTextBoxModule} from 'devextreme-angular';
// import { ContactsModule } from './contacts/contacts.module';
// import { HttpClientModule } from '@angular/common/http';


// @NgModule({
//   declarations: [
//     AppComponent,
    
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     DxButtonModule,
//     RouterModule,
//     DevExtremeModule,
//     DxBoxModule,
//     DragDropModule, 
//     CommonModule,
//     PipelineModule ,
//     SharedModule,
//     DxDataGridModule,
//     DxTextBoxModule,
//     ContactsModule,
//     DealInfoModule,
//     HttpClientModule
//   ],


// // const routes: Routes = [
// //   { path: 'contacts', component: ContactsComponent },
// //   { path: 'companies', component: CompaniesComponent },
// //   { path: 'dashboard', component: DashboardComponent },
// //   { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
// // ];

//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }



import { NgModule, Pipe } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DxButtonModule, DxDrawerModule, DxListModule } from 'devextreme-angular';
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { CompanyModule } from './company/company.module';
import { ContactsModule } from './contacts/contacts.module';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { PipelinepageComponent } from './pipeline/pipelinepage/pipelinepage.component';
import { ContactPageComponent } from './contacts/contact-page/contact-page.component';
import { CompanyPageComponent } from './company/company-page/company-page.component';
import { SharedModule } from './shared/shared.module';


const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'pipeline', component: PipelinepageComponent },
  { path: 'contacts', component: ContactPageComponent },
  { path: 'companies', component: CompanyPageComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    DxButtonModule,
    DxDrawerModule,
    DxListModule,
    DashboardModule,
    PipelineModule,
    CompanyModule,
    ContactsModule,
    SharedModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}