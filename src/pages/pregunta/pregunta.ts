import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GraciasPage } from '../gracias/gracias'


/**
 * Generated class for the PreguntaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pregunta',
  templateUrl: 'pregunta.html',
})
export class PreguntaPage {


  timeOutPregunta: any = (45000)

  pregunta: any = '';
  opciones: any = [];
  consol: any = '';
  encuesta: any;

  aGuardar: any = {
    foto: '',
    fecha: '',
    idDispositivo: '',
    idEncuesta: '',
    opciones: []
  };


  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.pregunta = this.navParams.get('pregunta')
    this.opciones = this.navParams.get('opciones')
    this.aGuardar = this.navParams.get('aGuardar')
    this.encuesta = this.navParams.get('encuesta')
    setTimeout(() => {
      if (this.navCtrl.getActive().name == 'PreguntaPage') {
        this.navCtrl.popAll()
          .then()
          .catch(e => {
            //this.loguear(e)
          })
      }
    }, this.timeOutPregunta)
  }

  loguear(log: any) {
    console.log(log + ' ' + new Date);
    console.log(log)
    //this.consol = text + ' ' + new Date;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreguntaPage');
  }

  preguntaSgte(opcion) {
    this.aGuardar.opciones.push(opcion.id)
    if (opcion.preguntasiguiente != null) {
      let preguntaSiguiente = this.preguntaPorId(opcion.preguntasiguiente)
      let opcionesSiguientes = this.opcionesPregunta(preguntaSiguiente)
      this.navCtrl.push(PreguntaPage, {
        pregunta: preguntaSiguiente,
        opciones: opcionesSiguientes,
        aGuardar: this.aGuardar,
        encuesta: this.encuesta
      })
        .then(() => {
          this.aGuardar = {
            foto: '',
            fecha: '',
            idDispositivo: '',
            idEncuesta: '',
            opciones: []
          };
        })
    } else {
      this.navCtrl.push(GraciasPage, { aGuardar: this.aGuardar })
        .then(() => {
          this.aGuardar = {
            foto: '',
            fecha: '',
            idDispositivo: '',
            idEncuesta: '',
            opciones: []
          };
        })
    }
  }

  /*FILTROS----------------------------------------------------------------*/
  opcionesPregunta(pregunta) {
    return JSON.parse(JSON.stringify(this.encuesta.opciones))
      .map(
      objeto => {
        return objeto;
      },
      err => this.loguear(err))
      .filter(
      objeto2 => {
        for (let id of pregunta.opciones) {
          if (objeto2.id == id) {
            return objeto2;
          }
        }
      },
      err => this.loguear(err)).sort(function (a, b) { return a.orden - b.orden });
  }

  preguntaPorId(paramId: number) {
    return JSON.parse(JSON.stringify(this.encuesta.preguntas))
      .map(objeto => { return objeto; }, err => this.loguear(err))
      .filter(objeto2 => { return objeto2.id == paramId; }, err => this.loguear(err))[0];
  }

  primerPregunta() {
    return JSON.parse(JSON.stringify(this.encuesta.preguntas))
      .map(objeto => { return objeto; }, err => this.loguear(err))
      .filter(objeto2 => { return objeto2.inicial == true; }, err => this.loguear(err))[0];
    //Ejemplo: {id: 1, pregunta: "Como...?", opciones: Array[3], inicial: true}
  }

  /*FIN FILTROS------------------------------------------------------------*/


}
