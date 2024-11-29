import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckSubscriptionsPage } from './check-subscriptions.page';

const routes: Routes = [
  {
    path: '',
    component: CheckSubscriptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckSubscriptionsPageRoutingModule {}
