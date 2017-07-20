import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraciasPage } from './gracias';

@NgModule({
  declarations: [
    GraciasPage,
  ],
  imports: [
    IonicPageModule.forChild(GraciasPage),
  ],
  exports: [
    GraciasPage
  ]
})
export class GraciasPageModule {}
