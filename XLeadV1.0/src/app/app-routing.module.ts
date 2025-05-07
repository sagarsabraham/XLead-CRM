import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  // {path: '',component:PipelinepageComponent},
  // {path:'pipeline',component:PipelinepageComponent}
  { path: '', redirectTo: 'pipeline', pathMatch: 'full' },
  { 
    path: 'pipeline', 
    loadChildren: () => import('./pipeline/pipeline.module').then(m => m.PipelineModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
