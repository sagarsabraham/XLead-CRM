import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', loadChildren: () =>
     import('./dashboard/dashboard.module').then(m => m.DashboardModule),
     data : {title : 'Dashboard'}
  },
  {path: 'pipeline', loadChildren: () =>
    import('./pipeline/pipeline.module').then(m => m.PipelineModule),
    data : {title : 'Pipelines'}
  },
  { path: 'dashboard', loadChildren: () =>
     import('./dashboard/dashboard.module').then(m => m.DashboardModule),
     data : {title : 'Dashboard'}
  },
  { path: 'contacts', loadChildren: () => 
    import('./contacts/contacts.module').then(m => m.ContactsModule),
    data : {title : 'Contacts'}
  },
  { 
    path: 'companies', loadChildren: () => 
    import('./company/company.module').then(m => m.CompanyModule),
    data : {title : 'Customers'}
  },
  { 
    path: 'overview', loadChildren: () => 
    import('./pipeline-overview/pipeline-overview.module').then(m => m.PipelineOverviewModule),
    data : {title : 'Pipeline Overview'}
  },
  {
    path: 'dealinfo', loadChildren: () =>
    import('./deal-info/deal-info.module').then(m => m.DealInfoModule),
    data : {title : 'Pipeline'}
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }