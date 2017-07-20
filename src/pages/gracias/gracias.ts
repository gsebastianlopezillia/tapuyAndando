import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PvdSqliteProvider } from '../../providers/pvd-sqlite/pvd-sqlite'


@IonicPage()
@Component({
  selector: 'page-gracias',
  templateUrl: 'gracias.html',
  providers: [PvdSqliteProvider],
})

export class GraciasPage {
  timeOutGracias: any = 5000;
  aGuardar: any = {
    foto: '',
    fecha: '',
    idDispositivo: '',
    idEncuesta: '',
    opciones: []
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: PvdSqliteProvider) {

    this.aGuardar = this.navParams.get('aGuardar')

  }

  loguear(log: any) {
    console.log(log + ' ' + new Date);
    console.log(log)
    //this.consol = text + ' ' + new Date;
  }

  ionViewDidLoad() {
    setTimeout(()=>{this.navCtrl.popAll()},this.timeOutGracias)
    setTimeout(() => {
      let resp = JSON.stringify(this.aGuardar);
      this.sqlite.insertRespuesta(resp)
        .then(res => {
          this.aGuardar = {
            foto: '',
            fecha: '',
            idDispositivo: '',
            idEncuesta: '',
            opciones: []
          }
        })
        .catch(e => {
          this.loguear(e)
          this.navCtrl.popAll()
        })
    }, 4000)
  }



}
