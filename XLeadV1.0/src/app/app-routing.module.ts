import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ContactPageComponent } from './contacts/contact-page/contact-page.component';


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
  { path: 'company', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule) },
   

  {path: 'dealinfo', loadChildren: () =>
    import('./deal-info/deal-info.module').then(m => m.DealInfoModule)
  },

  {path: '**', component: PageNotFoundComponent},
  

];
// const routes: Routes = [
//   { path: '', redirectTo: '/contact', pathMatch: 'full' },
//   { path: 'contact', component: ContactPageComponent },
//   { path: '**', redirectTo: '/contact' }
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }