import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', loadChildren: () =>
    import('./pipeline/pipeline.module').then(m => m.PipelineModule)
  },
  { path: 'dashboard', loadChildren: () =>
     import('./dashboard/dashboard.module').then(m => m.DashboardModule) 
  },

  { path: 'contact', loadChildren: () => 
    import('./contacts/contacts.module').then(m => m.ContactsModule) 
  },
  { path: 'overview', loadChildren: () => 
    import('./pipeline-overview/pipeline-overview.module').then(m => m.PipelineOverviewModule) 
  },
   

  {path: '**', component: PageNotFoundComponent},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
