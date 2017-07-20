import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular'

import { Device } from '@ionic-native/device'
import { NativeStorage } from '@ionic-native/native-storage'
import { CameraPreview, CameraPreviewPictureOptions } from '@ionic-native/camera-preview'
import { Network } from '@ionic-native/network'

import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http'
import { PvdCameraProvider } from '../../providers/pvd-camera/pvd-camera'
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage'
import { PvdSqliteProvider } from '../../providers/pvd-sqlite/pvd-sqlite'
import { NgModel } from '@angular/forms'
import { HomePage } from '../home/home'


/**
 * Generated class for the PreguntaSgtePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pregunta-sgte',
  templateUrl: 'pregunta-sgte.html',
})
export class PreguntaSgtePage {
  pregunta: any = '';
  opciones: any = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public homePage: HomePage) {
    
  }

  ionViewDidLoad() {
    this.loguear('ionViewDidLoad PreguntaSgtePage');
    this.cargar()
    this.loguear(this.pregunta)
    this.loguear(this.opciones)
  }

  loguear(log: any) {
    console.log(log + ' ' + new Date);
    console.log(log)
    //this.consol = text + ' ' + new Date;
  }

  cargar(){
    //this.pregunta = this.navParams.get('pregunta')
    //this.opciones = this.navParams.get('opciones')
  }

}
