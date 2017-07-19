import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class PvdStorageProvider {

  constructor(public nativeStorage: NativeStorage) {
  }

  setEncuesta(encuesta) {
    return this.nativeStorage
      .clear()
      .then(data => {
        return this.nativeStorage
          .setItem('encuesta', encuesta)
          .then(
          res => {
            //console.log('Success pvd-storage setEncuesta() setItem():');
            return res.json;
          },
          err => {
            //console.error('Fail pvd-storage setEncuesta() setItem():');
            //console.error(err);
            return err;
          });
      },
      err => {
        //console.error('Fail pvd-storage setEncuesta() clear():');
        //console.error(err)
        return err;
      });
  }
}
