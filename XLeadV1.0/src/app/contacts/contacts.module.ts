import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { SharedModule } from '../shared/shared.module';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';

@NgModule({
  declarations: [
    ContactPageComponent
  ],
  imports: [
    DxLoadIndicatorModule,
    CommonModule,
    ContactsRoutingModule,
    SharedModule
  ],
  exports: [
    ContactPageComponent
  ]
})
export class ContactsModule { }