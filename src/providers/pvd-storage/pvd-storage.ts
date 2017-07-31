import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class PvdStorageProvider {

  constructor(public nativeStorage: NativeStorage) {
  }

  setEncuesta(encuesta) {
    return this.nativeStorage
      .remove('encuesta')
      .then(data => {
        return this.nativeStorage
          .setItem('encuesta', encuesta)
          .then(
          res => {
            return res.json;
          },
          err => {
            return err;
          });
      },
      err => {
        return err;
      });
  }

  setVideo(video) {
    return this.nativeStorage
      .remove('video')
      .then(data => {
        return this.nativeStorage
          .setItem('video', video)
          .then(
          res => {
            return res.json;
          },
          err => {
            return err;
          });
      },
      err => {
        return err;
      });
  }

  setNombreVideo(videoName) {
    return this.nativeStorage
      .remove('videoName')
      .then(data => {
        return this.nativeStorage
          .setItem('videoName', videoName)
          .then(
          res => {
            return res.json;
          },
          err => {
            return err;
          });
      },
      err => {
        return err;
      });
  }
}
