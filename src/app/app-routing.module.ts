import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegComponent } from './survey-builder/components/reg/reg.component';
import { LoginComponent } from './survey-builder/components/login/login.component';
import { LayoutUserComponent } from './survey-builder/components/layout-user/layout-user.component';
import { LayoutAnoComponent } from './survey-builder/components/layout-ano/layout-ano.component';

const routes: Routes = [
  /**
   * `loadChildren()`: load a module lazily (improve performance); returns a Promise that resolves to the module
   *   the callback receives the imported module as an argument and returns the `m.<ModuleName>` which will be loaded when the route is visited
   * 🆚
   * `loadComponent()`: load a component directly
   *   takes a function that returns the component associated with the route
   */
  /**
   * Loading a module lazily instead of components leads to ASSERTION ERROR: NgModule 'LayoutUserComponent' is not a subtype of 'NgModuleType'
   */
  // {path: 'app', loadChildren: () => import('./app.module').then((m) => m.AppModule)},
  // {path: 'home', loadChildren: () => import('./components/layout-user/layout-user.component').then((m) => m.LayoutUserComponent)},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: LayoutUserComponent},
  {path: 'homeAnonymous', component:LayoutAnoComponent},
  {path: 'reg', component: RegComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }