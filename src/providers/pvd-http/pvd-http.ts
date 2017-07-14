import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Device } from '@ionic-native/device'

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage';

@Injectable()
export class PvdHttpProvider {

  //urlBase = 'http://tapuy.cloud.runaid.com.ar/device/';
  urlBase = 'http://192.168.0.53:8080/tapuy/device/';

  constructor(public http: Http,
    public pvdStorage: PvdStorageProvider,
    public device: Device) {
  }

  getJsonData() {
    //console.log('pvd-http getJsonData()->');
    this.getJsonData2()
      .then((response) => {
        //console.log('Success pvd-http getJsonData():');
        //console.log(response);
        this.pvdStorage.setEncuesta(response);
      })
      .catch((error) => {
        console.error('Fail pvd-http getJsonData():');
        console.error(error);
      });
  }

  getJsonData2() {
   //console.log('pvd-http getJsonData2()->');
    return this.http
      .get(this.urlBase + 'getEncuesta?idDispositivo=' + this.device.uuid + '&fechaModificacion=01/02/2017')
      .map((response) => response.json())
      .toPromise();
  }

  callPost(objRespuesta) {
    console.log('pvd-http callPost()->');
    let url = this.urlBase + 'addFormulario';
    let body = JSON.stringify(objRespuesta);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(url, body, options)
      .map(res => res.json())
      .toPromise()
  }
}
