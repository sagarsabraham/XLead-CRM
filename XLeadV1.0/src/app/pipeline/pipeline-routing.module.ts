import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipelinepageComponent } from './pipelinepage/pipelinepage.component';

const routes: Routes = [
  {path: '', component: PipelinepageComponent}, // Placeholder for the default route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PipelineRoutingModule { }
