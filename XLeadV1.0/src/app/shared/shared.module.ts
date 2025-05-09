import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DxButtonModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './button/button.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    DxButtonModule,
    RouterModule

  ],

  exports: [
    PageNotFoundComponent
  ]
})
export class SharedModule { }
