import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Device } from '@ionic-native/device'

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage';

@Injectable()
export class PvdHttpProvider {

  urlBase = 'http://tapuy.cloud.runaid.com.ar/device/';
  //urlBase = 'http://192.168.0.51:8080/tapuy/device/';

  constructor(public http: Http,
    public pvdStorage: PvdStorageProvider,
    public device: Device) {
  }

  getJsonData() {//promesa ok
    //console.log('pvd-http getJsonData()->');
    return this.getJsonData2()
      .then((response) => {
        //console.log('Success pvd-http getJsonData():');
        //console.log(response);
        return this.pvdStorage.setEncuesta(response)
          .then(res =>{
            //console.log('getJsonData() res:')
            //console.log(res)
            return res
          })
      })
      .catch((error) => {
        //console.error('Fail pvd-http getJsonData():');
        //console.error(error);
        return error
      });
  }

  getJsonData2() {
   //console.log('pvd-http getJsonData2()->');
    return this.http
      .get(this.urlBase + 'getEncuesta?idDispositivo=' + this.device.uuid + '&fechaModificacion=01/02/2017')
      .map((response) => response.json())
      .timeout(30000)
      .toPromise();
  }

  callPost(objRespuesta) {
    //console.log('pvd-http callPost()->');
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
