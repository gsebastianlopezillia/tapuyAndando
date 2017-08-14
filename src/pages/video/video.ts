import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VideoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare let KioskPlugin: any
@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  @ViewChild('input') myInput ;
  uuid: any
  video: any
  clave: any
  contadorBtnIzq: any = 0
  version: any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.video = this.navParams.get('video')
    this.uuid = this.navParams.get('uuid')
    this.version = this.navParams.get('version')
  }

  play() {
    let myVideo = document.getElementById('video');
    myVideo.setAttribute('src', this.video)
  }

  popear() {
    console.log('popeando')
    this.navCtrl.popToRoot()
  }

  ionViewDidLoad() {
    this.hideClave()
    this.play()
  }

  /*KIOSK-MODE-------------------------------------------------------------*/
  setClave(c) {
    this.clave = c;
  }

  deshabilitaKiosko() {
    KioskPlugin.exitKiosk();
  }

  clickBtnIzquierdo() {
    this.contadorBtnIzq++;
    this.confirmaClave();
  }

  confirmaClave() {
    if (this.contadorBtnIzq == 3) {
      this.showClave();
    }
  }

  showClave() {
    let divClave = document.getElementById('invisible')
    divClave.style.zIndex = '30'
    divClave.removeAttribute('hidden')
    let videoTag = document.getElementById('video')
    videoTag.removeAttribute('class')
    videoTag.setAttribute('class', 'abajo')
    setTimeout(() => { this.hideClave(); }, 25000)
    this.myInput.setFocus();
  }

  hideClave() {
    let divClave = document.getElementById('invisible');
    divClave.setAttribute("hidden", "true");
    let videoTag = document.getElementById('video')
    videoTag.removeAttribute('class')
    videoTag.setAttribute('class', 'centro')
    this.clave = '';
    this.contadorBtnIzq = 0;
  }

  desbloquear() {
    let clave = document.getElementById('clave');
    if (this.clave == 'lentes') {
      this.deshabilitaKiosko();
    }
  }

  /*FIN KIOSK-MODE---------------------------------------------------------*/

}
