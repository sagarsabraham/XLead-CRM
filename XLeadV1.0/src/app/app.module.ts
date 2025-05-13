import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { DxButtonModule, DxBoxModule, DxFileUploaderModule, DxPopupModule, DxFormModule, DxDateBoxModule, DxNumberBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { PipelineModule } from './pipeline/pipeline.module';
import { SharedModule } from './shared/shared.module';
import { DealInfoModule } from './deal-info/deal-info.module';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    DxButtonModule,
    DxBoxModule,
    DragDropModule, 
    CommonModule,
    PipelineModule ,
    SharedModule,
    DxFileUploaderModule,
    DxPopupModule,
    DxFormModule,
    DxNumberBoxModule,    
    DxSelectBoxModule,    
    DxDateBoxModule,
    DealInfoModule

   
    
  ],
  providers: [],
  bootstrap: [AppComponent],
 
})
export class AppModule { }