import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PvdSqliteProvider } from '../../providers/pvd-sqlite/pvd-sqlite'


/**
 * Generated class for the GraciasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-gracias',
  templateUrl: 'gracias.html',
  providers: [PvdSqliteProvider],
})
export class GraciasPage {
  timeOutGracias: any = 10000;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraciasPage');

    setTimeout(() => {
      let resp = JSON.stringify(this.aGuardar);
      this.sqlite.insertRespuesta(resp)
        .then(res => {
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          console.log(res)
          this.aGuardar = {
            foto: '',
            fecha: '',
            idDispositivo: '',
            idEncuesta: '',
            opciones: []
          };
        })
        .catch(e => {
          console.log(e)
        })
    }, 4000)
    setTimeout(() => { this.navCtrl.popAll(); }, this.timeOutGracias)
  }



}
