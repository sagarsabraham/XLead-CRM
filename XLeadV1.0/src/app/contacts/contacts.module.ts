import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { SharedModule } from '../shared/shared.module';
import { DxLoadIndicatorModule, DxToastModule } from 'devextreme-angular';
@NgModule({
  declarations: [
    ContactPageComponent
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    SharedModule,
    DxLoadIndicatorModule,DxToastModule
  ],
  exports: [
    ContactPageComponent
  ]
})
export class ContactsModule { }