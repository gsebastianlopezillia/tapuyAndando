import { Component } from '@angular/core'
import { NavController, NavParams, Platform, IonicApp } from 'ionic-angular'
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
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer'
import { File } from '@ionic-native/file'
//https://github.com/dsgriffin/ionic-3-file-transfer-example
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player'
//https://www.techiediaries.com/ionic-video-playing/
//import { AndroidPermissions } from '@ionic-native/android-permissions'
//https://developer.android.com/reference/android/Manifest.permission.html
//https://forum.ionicframework.com/t/applying-cordova-plugin-android-permissions-for-ionic-2/78125/6

declare let cordova: any
declare let KioskPlugin: any


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PvdHttpProvider, PvdCameraProvider, PvdStorageProvider, NgModel, FileTransfer, FileTransferObject, File]
})

export class HomePage {
  urlVideoRemota: any = 'http://192.168.0.55:8080/tapuy/device/verVideo?idencuesta='
  //urlVideoRemota: any = 'http://tapuy.cloud.runaid.com.ar/device/verVideo?idencuesta='

  reproduciendo: boolean = false
  version: any = '3.1.0'
  timeOutPrimerEncuesta: any = 30000
  timeOutSincronizar: any = 60000//3600000
  timeOutEncuestaNueva: any = 60000//3600000
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
  //video params

  videoOpts: VideoOptions;
  storageDirectory: string = cordova.file.dataDirectory;
  idEncuesta: any

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
    private network: Network,
    private transfer: FileTransfer,
    private file: File,
    public videoPlayer: VideoPlayer,
    private ionicApp: IonicApp) {
    platform.ready().then(() => {
      //this.permisos().then(res => this.loguear(res))
      this.inicio()
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
      setTimeout(() => { this.sincro() }, this.timeOutSincronizar)
      setTimeout(() => { this.pedirEncuestaNueva() }, this.timeOutEncuestaNueva)
    });
  }
  //----------------------------------------------------------------------------------------
  loguear(log: any) {
    console.log('----->' + log + ' ' + new Date);
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

  sincro() {
    setTimeout(() => { this.sincro() }, this.timeOutSincronizar)
    if (this.conectado) {
      this.loguear('Sincronizando')
      this.navCtrl.push(SincroPage, { 'image': this.encuesta.imagenSincro })
    }
  }

  pedirEncuestaNueva() {
    setTimeout(() => { this.pedirEncuestaNueva() }, this.timeOutEncuestaNueva)
    if (this.conectado) {
      this.loguear('Pidiendo encuesta remota')
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
  getEncuesta() {
    return this.nativeStorage.keys()
      .then((response) => {
        return response;
      })
      .then((response2) => {
        if (response2.indexOf('encuesta') > -1) {
          this.loguear('getItem(encuesta)---------------------')
          this.nativeStorage.getItem('encuesta').then(
            data => {
              this.encuesta = data.json
              if (this.encuesta.video) {
                this.loguear('ENCUESTA.VIDEO = TRUE')
                if (response2.indexOf('videoName') > -1) {
                  this.nativeStorage.getItem('videoName')
                    .then(res => {
                      if (this.encuesta.videoName != res) {
                        this.loguear('VIDEO NUEVO = TRUE')
                        if (this.reproduciendo) {
                          this.videoPlayer.close();
                          this.reproduciendo = false
                        }
                        this.borraVideo(res)
                        this.storage.setNombreVideo(this.encuesta.videoName)
                        this.loguear('Baja nuevo video')
                        this.downloadVideo(this.encuesta.encuesta)
                      } else {
                        this.loguear('VIDEO NUEVO = FALSE')
                        if (!this.reproduciendo) {
                          this.recuperaVideo()
                        }
                      }
                    })
                    .catch(err => { console.error(err) })
                } else {
                  this.storage.setNombreVideo(this.encuesta.videoName)
                  this.downloadVideo(this.encuesta.encuesta)
                }
              } else {
                this.loguear('ENCUESTA.VIDEO = FALSE')
                this.preguntaInicial = this.primerPregunta()
                this.opcionesIniciales = this.opcionesPregunta(this.preguntaInicial)
              }
            })
            .catch(e => this.loguear(e))
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

  /*FILE-TRANSFER----------------------------------------------------------*/
  inicio() {
    this.file.removeFile(this.storageDirectory, 'algo.txt')
  }


  downloadVideo(idEncuesta) {
    this.platform.ready().then(() => {
      this.loguear('Bajando video')
      const url = this.urlVideoRemota + idEncuesta;
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(url, this.storageDirectory + this.encuesta.videoName)
        .then(() => {
          this.loguear('Descarga exitosa')
          this.reproduciendo = true;
          this.loopear(this.storageDirectory + this.encuesta.videoName)
          //this.playVideo(this.storageDirectory + this.encuesta.videoName)
        }, (error) => {
          this.loguear(error)
        });
    });
  }

  recuperaVideo() {
    this.file.checkFile(this.storageDirectory, this.encuesta.videoName)
      .then(() => {
        this.loguear('Lectura exitosa')
        this.loopear(this.storageDirectory + this.encuesta.videoName)
      })
      .catch((err) => {
        this.loguear('Lectura fallida')
        this.loguear(err)
      });
  }

  borraVideo(videoName) {
    this.file.removeFile(this.storageDirectory, videoName)
      .then(() => console.log('Video eliminado con éxito: ' + videoName))
      .catch(err => console.error(err))
  }
  /*FIN FILE-TRANSFER------------------------------------------------------*/

  /*VIDEO PLAYER-----------------------------------------------------------*/
  playVideo(path) {
    this.reproduciendo = true
    this.videoOpts = { volume: 0 };
    return this.videoPlayer.play(path, this.videoOpts)
      .then(res => {
        this.loguear(res)
        return res
      }).catch(err => {
        this.loguear(err);
      });
  }

  loopear(path) {
    if (this.encuesta.video) {
      this.reproduciendo = true
      this.loguear('Reproduciendo: ' + path)
      this.playVideo(path).then(() => {
        this.loguear('Termina video')
        this.loopear(path)
      })
    } else {
      this.videoPlayer.close()
      this.reproduciendo = false
      this.preguntaInicial = this.primerPregunta()
      this.opcionesIniciales = this.opcionesPregunta(this.preguntaInicial)
    }
  }

  /*FIN VIDEO PLAYER------------------------------------------------------*/

}

