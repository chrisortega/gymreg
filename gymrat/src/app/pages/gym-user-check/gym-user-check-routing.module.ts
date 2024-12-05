import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GymUserCheckPage } from './gym-user-check.page';

const routes: Routes = [
  {
    path: '',
    component: GymUserCheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GymUserCheckPageRoutingModule {}
