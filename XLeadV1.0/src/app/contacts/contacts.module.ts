import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { ExportComponent } from '../export/export.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ 
    ContactPageComponent,
    ExportComponent,
    SidebarComponent
  ],

  imports: [
    CommonModule,
    ContactsRoutingModule,
    SharedModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactsModule { }
