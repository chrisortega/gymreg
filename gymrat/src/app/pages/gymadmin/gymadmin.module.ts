import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymadminPageRoutingModule } from './gymadmin-routing.module';

import { GymadminPage } from './gymadmin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GymadminPageRoutingModule
  ],
  declarations: [GymadminPage]
})
export class GymadminPageModule {}
