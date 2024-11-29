import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckSubscriptionsPageRoutingModule } from './check-subscriptions-routing.module';

import { CheckSubscriptionsPage } from './check-subscriptions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckSubscriptionsPageRoutingModule
  ],
  declarations: [CheckSubscriptionsPage]
})
export class CheckSubscriptionsPageModule {}
