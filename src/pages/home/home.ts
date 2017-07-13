import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device'
import { NativeStorage } from '@ionic-native/native-storage';
import { CameraPreview, CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
import { Network } from '@ionic-native/network';

import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http';
import { PvdCameraProvider } from '../../providers/pvd-camera/pvd-camera';
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage';
import { PvdSqliteProvider } from '../../providers/pvd-sqlite/pvd-sqlite';
import { NgModel } from '@angular/forms';

declare let KioskPlugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PvdHttpProvider, PvdCameraProvider, PvdStorageProvider, PvdSqliteProvider, NgModel]

})

export class HomePage {
  uuid: String;
  encuesta: any;
  preguntaInicial: any;
  opcionesInicialesCI: any = [];
  opcionesInicialesSI: any = [];
  preguntas: any = [];
  opciones: any = [];
  respuestas: any = [];
  clave: any;

  opcionesConImagen: any = [];
  opcionesSinImagen: any = [];

  contadorBtnDer: any = 0;
  contadorBtnIzq: any = 0;

  conectado: boolean = true;

  aGuardar: any = {
    foto: '',
    fecha: '',
    idDispositivo: '',
    idEncuesta: '',
    opciones: []
  };

  conImagenes: boolean = true;//declaro la bandera de imagenes
  //camera params
  picture: string = '';
  private pictureOpts: CameraPreviewPictureOptions = {
    width: 500,
    height: 500,
    quality: 20
  };

  //fin camera params
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public http: PvdHttpProvider,
    public sqlite: PvdSqliteProvider,
    public storage: PvdStorageProvider,
    public nativeStorage: NativeStorage,
    public camera: CameraPreview,
    private device: Device,
    private network: Network) {
    platform.ready().then(() => {

      let disconnectSub = this.network.onDisconnect().subscribe(() => {
        this.conectado = false;
        console.log('you are offline');
      });

      let connectSub = this.network.onConnect().subscribe(() => {
        this.conectado = true;
        console.log('you are online');
      });

      this.setUuid();
      setTimeout(() => { this.elDemonio(); }, 60000 * 2);

      //3600000
      Promise.all([this.traerEncuestaServidor()]).then(() => { this.getEncuesta() })

    });
  }

  /*SINCRONIZACION---------------------------------------------------------*/
  traerEncuestaServidor() {
    setTimeout(() => { this.traerEncuestaServidor(); }, 3700000);
    console.log('Buscando encuesta en servidor');
    if (this.conectado) {
      console.log('conectado y buscando');
      Promise.all([this.http.getJsonData()])
        .then(() => {
          this.getEncuesta();
        })
    } else {
      console.log('No conectado - No busco.');
    }
  }

  elDemonio() {
    console.log('Pasando por el demonio');
    //setTimeout(() => { this.elDemonio(); }, 3600000);
    setTimeout(() => { this.elDemonio(); }, 3600000);
    if (this.conectado) {
      this.sincronizar();
    } else {
      this.cargaTemplate1();
    }
  }

  sincronizar() {
    if (this.conectado) {
      this.opcionesConImagen = [];
      this.opcionesSinImagen = [];
      this.conImagenes = true;
      let pregCont = document.getElementById("preguntaContainer");
      pregCont.style.height = "100%";
      pregCont.innerHTML = 'MANTENIMIENTO <br/><img src="img/imagenencuesta.jpg" style="heigth: 100%; width:100%">';
      let opcContainer = document.getElementById('opcionesContainer');
      opcContainer.setAttribute('hidden', 'true');

      this.sincronizarBase();
    } else {
      this.cargaTemplate1();
    }
  }

  sincronizarBase() {
    Promise.all([this.sqlite.count()])
      .then(res => {
        if (res[0] > 0 && this.conectado) {
          console.log('this.sqlite.sincroniza():');
          Promise.all([this.sqlite.sincroniza()])
            .then(() => {
              this.sincronizarBase();
            })
        } else {
          console.log('Desconectado/baseVacia - No-Sincronizando');
          console.log(res[0]);
          this.cargaTemplate1();
        }
      })
  }

  continuara() {
    var cantRespondida = this.aGuardar.opciones;
    setTimeout(() => { this.continuaraAux(cantRespondida); }, 45000);
  }

  continuaraAux(val) {
    if (val == this.aGuardar.opciones) {
      this.cargaTemplate1();
    }
  }



  /*FIN SINCRONIZACION-----------------------------------------------------*/

  /*LOGICA-----------------------------------------------------------------*/
  finalizaEncuesta() {
    let resp = JSON.stringify(this.aGuardar);
    console.log('resp stringuifeada');
    console.log(resp);
    this.sqlite.insertRespuesta(resp);
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    this.conImagenes = true;
    var pregCont = document.getElementById("preguntaContainer");
    pregCont.style.height = "100%";
    pregCont.style.fontSize = "17em";
    pregCont.innerHTML = 'GRACIAS';
    setTimeout(() => { this.cargaTemplate1(); }, 15000);
  }

  cargaTemplate1() {
    this.clean();
    this.preguntaInicial = this.primerPregunta();
    console.log('this.preguntaInicial');
    console.log(this.preguntaInicial);
    var opcionesPregunta1 = this.opcionesPregunta(this.preguntaInicial);
    console.log('opcionesPregunta1');
    console.log(opcionesPregunta1);
    let opcContainer = document.getElementById('opcionesContainer');
    opcContainer.removeAttribute('hidden');
    var pregCont = document.getElementById("preguntaContainer");
    pregCont.style.height = "35%";
    pregCont.style.fontSize = "6.5em";

    pregCont.innerHTML = this.preguntaInicial.pregunta;
    if (this.conImagenes) {
      this.opcionesInicialesCI = opcionesPregunta1;
    } else {
      this.opcionesInicialesSI = opcionesPregunta1;
    }
  }

  preguntaSgte(opcion) {
    this.camera.takePicture(this.pictureOpts)
    this.continuara();
    this.aGuardar.opciones[this.aGuardar.opciones.length] = opcion.id;
    if (opcion.preguntasiguiente != null) {
      var preguntaActual = this.preguntaPorId(opcion.preguntasiguiente);
      var opcionesPreguntaActual = this.opcionesPregunta(preguntaActual);
      this.opcionesConImagen = [];
      this.opcionesSinImagen = [];
      var pregCont = document.getElementById("preguntaContainer");

      if (preguntaActual.pregunta != null) {
        pregCont.style.height = "35%";
        pregCont.style.fontSize = "6.5em";
        pregCont.innerHTML = preguntaActual.pregunta;
      } else {
        pregCont.style.height = "0%";
        pregCont.innerHTML = null;
      }
      if (this.conImagenes) {
        this.opcionesConImagen = opcionesPreguntaActual;
      } else {
        this.opcionesSinImagen = opcionesPreguntaActual;
      }
    } else {
      this.finalizaEncuesta()
    }
  }

  setAGuardar(opcion) {
    this.aGuardar.idDispositivo = this.uuid;
    let date = new Date();
    let myFormattedDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    this.aGuardar.fecha = myFormattedDate;
    console.log('this.aGuardar.fecha');
    console.log(this.aGuardar.fecha);
    this.aGuardar.idEncuesta = this.encuesta.json.encuesta;
  }

  clean() {
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    this.aGuardar = {
      foto: '',
      fecha: '',
      idDispositivo: '',
      idEncuesta: '',
      opciones: []
    };

  }

  /*FIN LOGICA-------------------------------------------------------------*/

  /*FILTROS----------------------------------------------------------------*/
  opcionesPregunta(pregunta) {
    this.conImagenes = true;
    return JSON.parse(JSON.stringify(this.encuesta.json.opciones))
      .map(
      objeto => {
        return objeto;
      },
      err => console.log(err))
      .filter(
      objeto2 => {
        for (let id of pregunta.opciones) {
          if (objeto2.id == id) {
            if (objeto2.imagen == '') {
              this.conImagenes = false;
            }
            return objeto2;
          }
        }
      },
      err => console.log(err)).sort(function (a, b) { return a.orden - b.orden });
  }

  preguntaPorId(paramId: number) {
    return JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map(objeto => { return objeto; }, err => console.log(err))
      .filter(objeto2 => { return objeto2.id == paramId; }, err => console.log(err))[0];
  }

  primerPregunta() {
    return JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map(objeto => { return objeto; }, err => console.log(err))
      .filter(objeto2 => { return objeto2.inicial == true; }, err => console.log(err))[0];
    //Ejemplo: {id: 1, pregunta: "Como...?", opciones: Array[3], inicial: true}
  }

  /*FIN FILTROS------------------------------------------------------------*/

  /*SQLITE-----------------------------------------------------------------*/
  insertRespuesta(obj) {
    console.log('obj de insert');
    console.log(obj);
    return this.sqlite.insertRespuesta(JSON.stringify(obj))
      .catch(e => {
      })
  }

  /*FIN SQLITE-------------------------------------------------------------*/

  /*DEVICE-----------------------------------------------------------------*/
  setUuid() {
    this.uuid = this.device.uuid;
  }

  /*FIN DEVICE-------------------------------------------------------------*/

  /*HTTP-------------------------------------------------------------------*/
  getEncuestaRemota() {
    Promise.all([this.http.getJsonData()])
      .then(res => {
        this.encuesta = res[0];
        console.log('getEncuestaRemota :');
        console.log(this.encuesta)
      })
  }

  /*FIN HTTP---------------------------------------------------------------*/

  /*KIOSK-MODE-------------------------------------------------------------*/
  setClave(c) {
    this.clave = c;
  }

  deshabilitaKiosko() {
    KioskPlugin.exitKiosk();
  }

  /*clickBtnDerecho() {
    if (this.contadorBtnIzq != 2) {
      this.contadorBtnDer = 0;
      this.contadorBtnIzq = 0;
    } else {
      this.contadorBtnDer++;
    }
  }*/

  clickBtnIzquierdo() {
    this.contadorBtnIzq++;
    this.confirmaClave();
  }

  confirmaClave() {
    if (this.contadorBtnIzq == 3) {
      this.showClave();
    }
    /*switch (this.contadorBtnIzq) {
      case 1: {
        if (this.contadorBtnDer != 0) {
          this.contadorBtnDer = 0;
          this.contadorBtnIzq = 0;
        }
        break;
      }
      case 2: {
        if (this.contadorBtnDer != 0) {
          this.contadorBtnDer = 0;
          this.contadorBtnIzq = 0;
        }
        break;
      }
      case 3: {
        if (this.contadorBtnDer != 1) {
          this.contadorBtnDer = 0;
          this.contadorBtnIzq = 0;
        } else {
          this.showClave();
        }
        break;
      }
      default: {
        this.contadorBtnDer = 0;
        this.contadorBtnIzq = 0;
        break;
      }
    }*/
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
    this.nativeStorage.getItem('encuesta').then(
      data => {
        this.encuesta = JSON.parse(JSON.stringify(data));
        this.preguntas = this.encuesta.json.preguntas;
        this.preguntas.sort(function (a, b) { return a.orden - b.orden });
        this.opciones = this.encuesta.json.opciones;
        this.opciones.sort(function (a, b) { return a.orden - b.orden });
        this.cargaTemplate1();
      },
      error => {
        console.error('Error reading item ');
        console.error(JSON.parse(error))
      });
  }

  /*FIN NATIVE-STORAGE-----------------------------------------------------*/

  /*CAMERA-----------------------------------------------------------------*/
  sacaFoto(opcion) {
    this.setAGuardar(opcion);
    if (opcion.preguntasiguiente != 'null') {
      this.opcionesInicialesCI = [];
      this.opcionesInicialesSI = [];
      this.preguntaSgte(opcion);
    } else {
      this.opcionesInicialesCI = [];
      this.opcionesInicialesSI = [];
      this.finalizaEncuesta();
    }
    this.camera.takePicture(this.pictureOpts).then((imageData) => {
      this.aGuardar.foto = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      console.log('Fail take: ' + err);
    });
  }

  /*FIN CAMERA-------------------------------------------------------------*/
}

