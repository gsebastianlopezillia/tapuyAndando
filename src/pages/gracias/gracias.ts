import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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
})
export class GraciasPage {
  timeOutGracias: any = 10000;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraciasPage');
    setTimeout(()=>{this.navCtrl.popAll();},this.timeOutGracias)
  }

  

}
