import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymUserCheckPageRoutingModule } from './gym-user-check-routing.module';

import { GymUserCheckPage } from './gym-user-check.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GymUserCheckPageRoutingModule
  ],
  declarations: [GymUserCheckPage]
})
export class GymUserCheckPageModule {}
