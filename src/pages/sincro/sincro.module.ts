import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SincroPage } from './sincro';

@NgModule({
  declarations: [
    SincroPage,
  ],
  imports: [
    IonicPageModule.forChild(SincroPage),
  ],
  exports: [
    SincroPage
  ]
})
export class SincroPageModule {}
