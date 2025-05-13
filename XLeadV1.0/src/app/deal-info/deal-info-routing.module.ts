import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealinfopageComponent } from './dealinfopage/dealinfopage.component';

const routes: Routes = [
  // {path: ':dealId', component: DealinfopageComponent},
  {path: '', component: DealinfopageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealInfoRoutingModule { }
