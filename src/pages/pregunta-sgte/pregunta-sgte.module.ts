import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreguntaSgtePage } from './pregunta-sgte';

@NgModule({
  declarations: [
    PreguntaSgtePage,
  ],
  imports: [
    IonicPageModule.forChild(PreguntaSgtePage),
  ],
  exports: [
    PreguntaSgtePage
  ]
})
export class PreguntaSgtePageModule {}
