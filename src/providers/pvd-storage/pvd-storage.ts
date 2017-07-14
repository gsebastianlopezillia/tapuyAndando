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
}
