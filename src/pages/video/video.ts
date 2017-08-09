import { Component } from '@angular/core';
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
  uuid: any
  video: any
  clave: any
  contadorBtnIzq: any = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.video = this.navParams.get('video')
    this.uuid = this.navParams.get('uuid')
  }

  play() {
    let myVideo = document.getElementById('video2');
    myVideo.setAttribute('src', this.video)
  }

  popear(){
    console.log('popeando')
    this.navCtrl.popToRoot()
  }

  ionViewDidLoad() {
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
    divClave.removeAttribute("hidden")
    setTimeout(() => { this.hideClave(); }, 25000)
  }

  hideClave() {
    let divClave = document.getElementById('invisible');
    divClave.setAttribute("hidden", "true");
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
