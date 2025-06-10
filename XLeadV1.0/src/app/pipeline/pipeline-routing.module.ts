import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipelinepageComponent } from './pipelinepage/pipelinepage.component';

const routes: Routes = [
  { path: '', component: PipelinepageComponent, data: { title: 'Pipelines' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PipelineRoutingModule { }
