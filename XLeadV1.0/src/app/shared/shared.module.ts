import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon/icon.component';
import { IconTextComponent } from './icon-text/icon-text.component';
import { ProfileComponent } from './profile/profile.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { HeadersearchComponent } from './headersearch/headersearch.component';
import { TableOutlineComponent } from './table-outline/table-outline.component';


@NgModule({
  declarations: [
    IconComponent,
    IconTextComponent,
    ProfileComponent,
    SidenavComponent,
    SidebarComponent,
    CheckboxComponent,
    ContactsTableComponent,
    HeadersearchComponent,
    TableOutlineComponent
  ],
  
  imports: [
    CommonModule
   
  ],

  exports: [
    IconComponent,
    IconTextComponent,
    ProfileComponent,
    SidenavComponent,
    SidebarComponent,
    CheckboxComponent,
    ContactsTableComponent,
    HeadersearchComponent,
    TableOutlineComponent
  ],
// schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SharedModule { }