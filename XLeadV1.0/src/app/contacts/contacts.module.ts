import { NgModule } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { ContactPageComponent } from './contact-page/contact-page.component';
   import { SharedModule } from '../shared/shared.module';
import { ContactsRoutingModule } from './contacts-routing.module';

   @NgModule({
     declarations: [
       ContactPageComponent
     ],
     imports: [
       CommonModule,
       ContactsRoutingModule,
       SharedModule // Import SharedModule to use TableComponent
     ]
   })
   export class ContactsModule { }