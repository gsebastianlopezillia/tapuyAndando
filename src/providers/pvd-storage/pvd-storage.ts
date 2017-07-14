import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class PvdStorageProvider {

  constructor(public nativeStorage: NativeStorage) {
  }

  //guarda una encuesta en el dispositivo
  setEncuesta(encuesta) {
    this.nativeStorage
      .remove('encuesta')
      .then(data => {
        this.nativeStorage
          .setItem('encuesta', encuesta)
          .then(
          () => console.log('Success pvd-storage setEncuesta()'),
          err => {
            console.error('Fail pvd-storage setEncuesta():');
            console.error(err);
          });
      },
      err => console.log(err));
  }

  //obtiene la encuesta almacenada en el dispositivo
  getEncuesta() {
    console.log('pvd-storage getEncuesta()->');
    return this.nativeStorage
      .getItem('encuesta')
      .then(data => {
        console.log('respuesta de getEncuesta en pvdStorage');
        console.log(JSON.parse(JSON.stringify(data)));
        return JSON.parse(JSON.stringify(data));
      },
      err => {
        console.error('Fail pvd-storage getEncuesta():');
        console.error(err);
      })
  }

  //borra la encuesta almacenada en el dispositivo
  removeEncuesta() {
    return this.nativeStorage.remove('encuesta').then(
      data => console.log('Encuesta removida.'),
      err => console.log(err));
  }

}
