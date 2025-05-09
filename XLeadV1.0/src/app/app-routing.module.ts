import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', loadChildren: () =>
    import('./pipeline/pipeline.module').then(m => m.PipelineModule)
  },

  
  // {path: '',component:PipelinepageComponent},
  // {path:'pipeline',component:PipelinepageComponent}
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  {path: '**', component: PageNotFoundComponent},
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: 'pipeline', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
