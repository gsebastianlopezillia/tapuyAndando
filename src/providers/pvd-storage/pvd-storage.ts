import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class PvdStorageProvider {

  constructor(public nativeStorage: NativeStorage) {
  }

  setEncuesta(encuesta) {
    this.nativeStorage
      .clear()
      .then(data => {
        this.nativeStorage
          .setItem('encuesta', encuesta)
          .then(
          () => {
            console.log('Success pvd-storage setEncuesta()');
            return (true);
          },
          err => {
            console.error('Fail pvd-storage setEncuesta() setItem():');
            console.error(err);
            return (false);
          });
      },
      err => {
        console.error('Fail pvd-storage setEncuesta() clear():');
        console.log(err)
        return (false);
      });
  }

  //obtiene la encuesta almacenada en el dispositivo
  getEncuesta() {
    console.log('Success pvd-storage getEncuesta()->');
    return this.nativeStorage.keys()
      .then((response) => {
        console.log('Success pvd-storage getEncuesta()1:');
        console.log(response);
        return response;
      })
      .then((response2) => {
        console.log('Success pvd-storage getEncuesta()2:');
        console.log(response2);
        if(response2.lenght > 0){
          return this.nativeStorage
          .getItem('encuesta')
          .then(data => {
            console.log('Success pvd-storage getEncuesta()3->');
            console.log(JSON.parse(JSON.stringify(data)));
            return JSON.parse(JSON.stringify(data));
          },
          err => {
            console.error('Fail pvd-storage getEncuesta():');
            console.error(err);
          })
        }else{
          console.error('Fail pvd-storage getEncuesta() Storage Vacío.');
        }  
      })

  }
}
