import { NgModule, Pipe } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<<<<<<< HEAD

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
=======
import { RouterModule, Routes } from '@angular/router';
import { DxButtonModule, DxDrawerModule, DxListModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
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
import { DealInfoModule } from './deal-info/deal-info.module';
import { HttpClientModule } from '@angular/common/http';

 

const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'pipeline', component: PipelinepageComponent },
  { path: 'contacts', component: ContactPageComponent },
  { path: 'companies', component: CompanyPageComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
>>>>>>> 325271a8456b435c271682d4f14c87eb343b1e6d


@NgModule({
  declarations: [
<<<<<<< HEAD
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
=======
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    DxButtonModule,
    DxDrawerModule,
    DxListModule,
    DxLoadIndicatorModule,
    DashboardModule,
    HttpClientModule,
    PipelineModule,
    CompanyModule,
    ContactsModule,
    SharedModule,
    AppRoutingModule,
    DealInfoModule
>>>>>>> 325271a8456b435c271682d4f14c87eb343b1e6d
  ],
  bootstrap: [AppComponent],
  providers: []
})
<<<<<<< HEAD
export class AppModule { }
=======
export class AppModule {}
>>>>>>> 325271a8456b435c271682d4f14c87eb343b1e6d
