import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ContactPageComponent } from './contacts/contact-page/contact-page.component';


const routes: Routes = [
  {path: '', loadChildren: () =>
    import('./pipeline/pipeline.module').then(m => m.PipelineModule)
  },

  {path: '**', component: PageNotFoundComponent},
];
const routes: Routes = [
  { path: '', redirectTo: '/contact', pathMatch: 'full' },
  { path: 'contact', component: ContactPageComponent },
  { path: '**', redirectTo: '/contact' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }