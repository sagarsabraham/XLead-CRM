import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DxButtonModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PageNotFoundComponent
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
