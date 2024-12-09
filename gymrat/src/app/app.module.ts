import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';


@NgModule({
  declarations: [AppComponent,SharedHeaderComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,    IonicStorageModule.forRoot(), HttpClientModule  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
