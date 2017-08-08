import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http'
import { PvdSqliteProvider } from '../../providers/pvd-sqlite/pvd-sqlite'
import { Network } from '@ionic-native/network'


/**
 * Generated class for the SincroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sincro',
  templateUrl: 'sincro.html',
  providers: [PvdHttpProvider, PvdSqliteProvider]
})
export class SincroPage {

  conectado: boolean = true;
  image: any = 'img/imagenencuesta.jpg'

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: PvdSqliteProvider,
    public http: PvdHttpProvider,
    private network: Network) {
    let disconnectSub = this.network.onDisconnect().subscribe(() => {
      this.conectado = false;
      this.loguear('Desconectado');
    });
    let connectSub = this.network.onConnect().subscribe(() => {
      this.conectado = true;
      this.loguear('Conectado');
    });
    if (this.network.type === 'none') {
      this.conectado = false
      this.loguear('Device sin conexión')
    }
    setTimeout(() => { this.comprobarBase() }, 3000)
    if (this.navParams.get('image') != '') {
      console.log('Imagen de encuesta')
      console.log(this.navParams.get('image'))
      this.image = this.navParams.get('image')
    } else {
      console.log('Imagen por default')
    }
  }

  loguear(log: any) {
    console.log(log + ' ' + new Date);
    console.log(log)
    //this.consol = text + ' ' + new Date;
  }

  ionViewDidLoad() {
    setTimeout(() => { this.comprobarBase }, 3000)
  }

  comprobarBase() {
    this.sqlite.count()
      .then(res => {
        if (res == 0) {
          setTimeout(() => {
            this.navCtrl.popToRoot()
              .then()
              .catch(e => {
                //this.loguear(e)
              })
          }, 5000)

        } else {
          this.mandar()
        }
      })
  }

  mandar() {
    if (this.conectado) {
      this.sqlite.sincroniza()
        .then(res => {
          this.comprobarBase()
        })
    } else {
      setTimeout(() => {
        this.navCtrl.popToRoot()
          .then()
          .catch(e => {
            //this.loguear(e)
          })
      }, 5000)
    }
  }

}
