import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconComponent } from './shared/icon/icon.component';
import { IconTextComponent } from './shared/icon-text/icon-text.component';

// const routes: Routes = [
//   { path: 'contacts', component: ContactsComponent },
//   { path: 'companies', component: CompaniesComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
// ];

@NgModule({
  declarations: [
    AppComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconComponent,
    IconTextComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
