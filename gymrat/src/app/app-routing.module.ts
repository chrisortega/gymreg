import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'check-subscriptions',
    pathMatch: 'full'
  },
  {
    path: 'check-subscriptions',
    loadChildren: () => import('./pages/check-subscriptions/check-subscriptions.module').then( m => m.CheckSubscriptionsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'manage-users',
    loadChildren: () => import('./pages/manage-users/manage-users.module').then( m => m.ManageUsersPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-user',
    loadChildren: () => import('./pages/add-user/add-user.module').then( m => m.AddUserPageModule),
    canActivate: [AuthGuard],
  },

  
  { path: 'edit-user/:id', 
    loadChildren: () => import('./pages/edit-user/edit-user.module').then(m => m.EditUserPageModule),
    canActivate: [AuthGuard],
   },
  {
    path: 'entries',
    loadChildren: () => import('./pages/entries/entries.module').then( m => m.EntriesPageModule),
    canActivate: [AuthGuard],

  },
  {
    path: 'gym-user-check',
    loadChildren: () => import('./pages/gym-user-check/gym-user-check.module').then( m => m.GymUserCheckPageModule)
  },
  {
    path: 'gymadmin',
    loadChildren: () => import('./pages/gymadmin/gymadmin.module').then( m => m.GymadminPageModule)
  },
  



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
