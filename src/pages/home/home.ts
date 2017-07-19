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
  consol: any = '';

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
  //----------------------------------------------------------------------------------------
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
        this.loguear('Desconectado');
      });

      let connectSub = this.network.onConnect().subscribe(() => {
        this.conectado = true;
        this.loguear('Conectado');
        this.traerEncuestaServidor()
      });

      if (this.network.type === 'none') {
        this.conectado = false
        this.loguear('Device sin conexión')
      }

      //setTimeout(() => { this.elDemonio(); }, 60000 * 60)
      setTimeout(() => { this.elDemonio(); }, 60000 * 2)
      this.traerEncuestaServidor()

      this.uuid = this.device.uuid;
    });
  }

  loguear(text: any) {
    console.log(text + ' ' + new Date);
    this.consol = text + ' ' + new Date;
  }

  /*SINCRONIZACION---------------------------------------------------------*/
  traerEncuestaServidor() {
    setTimeout(() => { this.traerEncuestaServidor(); }, 60000 * 4);
    this.getEncuesta()
    //setTimeout(() => { this.traerEncuestaServidor(); }, 60000 * 121);
    if (this.conectado) {
      this.loguear('traerEncuestaServidor() ' + new Date)
      this.http.getJsonData()
        .then(res => {
          this.loguear('Encuesta recibida.')
          //this.loguear(res)
          this.getEncuesta()
        })
        .catch(e => {
          this.loguear(e)
          this.loguear('Fallo búsqueda encuesta.')
        })
    } else {
      this.loguear('No conectado - No busco.');
    }
  }

  elDemonio() {
    setTimeout(() => { this.elDemonio(); }, 60000 * 2);
    //setTimeout(() => { this.elDemonio(); }, 60000 * 60);
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
      pregCont.innerHTML = '<img src="img/imagenencuesta.jpg" style="heigth: 100%; width:100%">';
      let opcContainer = document.getElementById('opcionesContainer');
      opcContainer.setAttribute('hidden', 'true');
      this.sincronizarBase();
    } else {
      this.cargaTemplate1();
    }
  }

  sincronizarBase() {
    this.sqlite.count()
      .then(res => {
        if (this.conectado) {
          if (res > 0) {
            this.loguear('sincronizar enviando respuesta')
            this.sqlite.sincroniza()
              .then((res) => {
                this.loguear('Respuesta de envío')
                this.sincronizarBase();
              })
          } else {
            this.loguear('sincronizar finalizado')
            this.cargaTemplate1();
          }
        } else {
          //this.consol += 'baseVacia/Desconectado -|-';
          this.loguear('Desconectado - No-Sincronizando');
          this.cargaTemplate1();
        }
      })
  }

  continuara() {
    var cantRespondida = this.aGuardar.opciones;
    setTimeout(() => { this.continuaraAux(cantRespondida); }, 45000);
    //setTimeout(() => { this.continuaraAux(cantRespondida); }, 20000);
  }

  continuaraAux(val) {
    if (val == this.aGuardar.opciones) {
      this.cargaTemplate1();
    }
  }

  /*FIN SINCRONIZACION-----------------------------------------------------*/

  /*LOGICA-----------------------------------------------------------------*/
  finalizaEncuesta() {
    setTimeout(() => { this.cargaTemplate1(); }, 2000);
    this.loguear('Guardando respuesta...')
    var pregCont = document.getElementById("preguntaContainer");
    pregCont.style.height = "100%";
    pregCont.style.fontSize = "17em";
    pregCont.innerHTML = 'GRACIAS';
    let resp = JSON.stringify(this.aGuardar);
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    this.conImagenes = true;
    this.sqlite.insertRespuesta(resp)
      .then(res => {
        this.loguear('Respuesta guardada')
      })
  }

  cargaTemplate1() {
    this.opcionesConImagen = [];
    this.opcionesSinImagen = [];
    this.aGuardar = {
      foto: '',
      fecha: '',
      idDispositivo: '',
      idEncuesta: '',
      opciones: []
    };
    this.preguntaInicial = this.primerPregunta();
    let opcionesPregunta1 = this.opcionesPregunta(this.preguntaInicial);
    let opcContainer = document.getElementById('opcionesContainer');
    let pregCont = document.getElementById("preguntaContainer");
    opcContainer.removeAttribute('hidden');
    pregCont.style.height = "35%";
    pregCont.style.fontSize = "6.5em";
    pregCont.innerHTML = this.preguntaInicial.pregunta;
    if (this.conImagenes) {
      this.opcionesInicialesCI = opcionesPregunta1;
    } else {
      this.opcionesInicialesSI = opcionesPregunta1;
    }
    this.loguear('Comenzar...')
  }

  preguntaSgte(opcion) {
    this.loguear('Continuar...')
    this.aGuardar.opciones[this.aGuardar.opciones.length] = opcion.id;
    if (opcion.preguntasiguiente != null) {
      this.camera.takePicture(this.pictureOpts)
      this.opcionesConImagen = [];
      this.opcionesSinImagen = [];
      let preguntaActual = this.preguntaPorId(opcion.preguntasiguiente);
      let opcionesPreguntaActual = this.opcionesPregunta(preguntaActual);
      let pregCont = document.getElementById("preguntaContainer");
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
      this.camera.takePicture(this.pictureOpts)
      this.finalizaEncuesta()
    }

    this.continuara();
    
  }

  setAGuardar(opcion) {
    this.aGuardar.idDispositivo = this.uuid;
    let date = new Date();
    let myFormattedDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    this.aGuardar.fecha = myFormattedDate;
    this.aGuardar.idEncuesta = this.encuesta.json.encuesta;
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
      err => this.loguear(err))
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
      err => this.loguear(err)).sort(function (a, b) { return a.orden - b.orden });
  }

  preguntaPorId(paramId: number) {
    return JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
      .map(objeto => { return objeto; }, err => this.loguear(err))
      .filter(objeto2 => { return objeto2.id == paramId; }, err => this.loguear(err))[0];
  }

  primerPregunta() {
    return JSON.parse(JSON.stringify(this.encuesta.json.preguntas))
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
              this.loguear('-----Encuesta local encontrada');
              this.encuesta = JSON.parse(JSON.stringify(data));
              this.preguntas = this.encuesta.json.preguntas;
              this.preguntas.sort(function (a, b) { return a.orden - b.orden });
              this.opciones = this.encuesta.json.opciones;
              this.opciones.sort(function (a, b) { return a.orden - b.orden });
              this.cargaTemplate1()
              return data;

            });
        } else {
          this.loguear('Storage vacío');
        }
      });
  }
  /*FIN NATIVE-STORAGE-----------------------------------------------------*/

  /*CAMERA-----------------------------------------------------------------*/
  sacaFoto(opcion) {
    
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
      this.loguear(err);
    });
    this.setAGuardar(opcion);
  }

  /*FIN CAMERA-------------------------------------------------------------*/
}

