import { Component } from '@angular/core'
import { NavController, NavParams, Platform } from 'ionic-angular'
import { Device } from '@ionic-native/device'
import { NativeStorage } from '@ionic-native/native-storage'
import { CameraPreview, CameraPreviewPictureOptions } from '@ionic-native/camera-preview'
import { Network } from '@ionic-native/network'

import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http'
import { PvdCameraProvider } from '../../providers/pvd-camera/pvd-camera'
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage'
import { NgModel } from '@angular/forms'

import { GraciasPage } from '../gracias/gracias'
import { PreguntaPage } from '../pregunta/pregunta'
import { SincroPage } from '../sincro/sincro'

declare let KioskPlugin: any

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PvdHttpProvider, PvdCameraProvider, PvdStorageProvider, NgModel]

})

export class HomePage {

  //preguntaSgtePage: PreguntaSgtePage
  version: any = '3.0.1'

  timeOutPrimerEncuesta: any = (60000 * 2)
  timeOutSincronizar: any = (60000 * 3)

  preguntaInicial: any = '';
  opcionesIniciales: any = [];

  consol: any = '';

  uuid: String;
  encuesta: any;
  clave: any;
  contadorBtnIzq: any = 0;
  conectado: boolean = true;

  aGuardar: any = {
    foto: '',
    fecha: '',
    idDispositivo: '',
    idEncuesta: '',
    opciones: []
  };

  //camera params
  picture: string = '';
  private pictureOpts: CameraPreviewPictureOptions = {
    width: 500,
    height: 500,
    quality: 20
  };
  //fin camera params
  //----------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public http: PvdHttpProvider,
    public storage: PvdStorageProvider,
    public nativeStorage: NativeStorage,
    public camera: CameraPreview,
    private device: Device,
    private network: Network) {
    platform.ready().then(() => {
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
      this.uuid = this.device.uuid
      this.getEncuesta()
      setTimeout(() => {this.sincro()}, this.timeOutSincronizar)
    });
  }

  loguear(log: any) {
    console.log(log + ' ' + new Date);
    console.log(log)
    //this.consol = text + ' ' + new Date;
  }

  /*SINCRONIZACION---------------------------------------------------------*/
  pedirPrimerEncuesta() {
    if (this.conectado) {
      this.loguear('pedirPrimerEncuesta()')
      this.http.getJsonData()
        .then(res => {
          this.loguear(res)
          this.getEncuesta()
        })
        .catch(e => {
          this.loguear(e)
          this.loguear('Fallo búsqueda encuesta.')
        })
    } else {
      this.loguear('No conectado - No busco.');
      setTimeout(() => { this.pedirPrimerEncuesta() }, this.timeOutPrimerEncuesta)
    }
  }

  sincro(){
    setTimeout(() => {this.sincro()}, this.timeOutSincronizar)
    if(this.conectado){
      this.navCtrl.push(SincroPage)
    }
  }

  /*FIN SINCRONIZACION-----------------------------------------------------*/

  /*LOGICA-----------------------------------------------------------------*/
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

  setAGuardar() {
    this.aGuardar.idDispositivo = this.uuid;
    let date = new Date();
    let myFormattedDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    this.aGuardar.fecha = myFormattedDate;
    this.aGuardar.idEncuesta = this.encuesta.encuesta;
  }
  /*FIN LOGICA-------------------------------------------------------------*/

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
            if (objeto2.imagen == '') {
              //asd
            }
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
    let divClave = document.getElementById('invisibe');
    divClave.removeAttribute("hidden");
    setTimeout(() => { this.hideClave(); }, 25000);
  }

  hideClave() {
    let divClave = document.getElementById('invisibe');
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

  /*NATIVE-STORAGE---------------------------------------------------------*/
  getEncuesta() {//not tocar
    return this.nativeStorage.keys()
      .then((response) => {
        return response;
      })
      .then((response2) => {
        if (response2.length > 0) {
          this.nativeStorage.getItem('encuesta').then(
            data => {
              this.encuesta = data.json
              this.preguntaInicial = this.primerPregunta()
              this.opcionesIniciales = this.opcionesPregunta(this.preguntaInicial)
              return data;
            });
        } else {
          this.pedirPrimerEncuesta();
        }
      });
  }
  /*FIN NATIVE-STORAGE-----------------------------------------------------*/

  /*CAMERA-----------------------------------------------------------------*/
  sacaFoto(opcion) {
    this.preguntaSgte(opcion)
    this.camera.takePicture(this.pictureOpts).then((imageData) => {
      this.aGuardar.foto = 'data:image/jpeg;base64,' + imageData;
      //foto tomada
    }, (err) => {
      this.loguear(err);
    });
    this.setAGuardar()
  }

  /*FIN CAMERA-------------------------------------------------------------*/

  
}

