import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ContactPageComponent } from './contacts/contact-page/contact-page.component';


const routes: Routes = [
  {path: 'pipeline', loadChildren: () =>
    import('./pipeline/pipeline.module').then(m => m.PipelineModule)
  },
  { path: 'dashboard', loadChildren: () =>
     import('./dashboard/dashboard.module').then(m => m.DashboardModule) 
  },

  { path: 'contacts', loadChildren: () => 
    import('./contacts/contacts.module').then(m => m.ContactsModule) 
  },
  { 
    path: 'companies', loadChildren: () => 
    import('./company/company.module').then(m => m.CompanyModule)
  },
  { 
    path: 'overview', loadChildren: () => 
    import('./pipeline-overview/pipeline-overview.module').then(m => m.PipelineOverviewModule) 
  },
  {
    path: 'dealinfo', loadChildren: () =>
    import('./deal-info/deal-info.module').then(m => m.DealInfoModule)
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