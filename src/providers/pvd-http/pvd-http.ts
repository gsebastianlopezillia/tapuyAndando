import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Device } from '@ionic-native/device'

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { PvdStorageProvider } from '../../providers/pvd-storage/pvd-storage';

@Injectable()
export class PvdHttpProvider {

  //urlBase = 'http://tapuy.cloud.runaid.com.ar/device/';
  urlBase = 'http://192.168.0.55:8080/tapuy/device/';
//EDITAR URL DE VIDEO EN EL HOME!!!!!!!!!!!!!!
  constructor(public http: Http,
    public pvdStorage: PvdStorageProvider,
    public device: Device) {
  }

  getJsonData() {//promesa ok
    return this.getJsonData2()
      .then((response) => {
        return this.pvdStorage.setEncuesta(response)
          .then(res =>{ return 'Encuesta Guardada' },
          err =>{ return 'Fallo guardado encuesta' })
      })
      .catch((error) => { return error });
  }

  getJsonData2() {
   console.log(this.urlBase + 'getEncuesta?idDispositivo=' + this.device.uuid + '&fechaModificacion=01/02/2017');
    return this.http
      .get(this.urlBase + 'getEncuesta?idDispositivo=' + this.device.uuid + '&fechaModificacion=01/02/2017')
      .map((response) => response.json())
      .toPromise();
  }

  getVideo(idEncuesta) {
   console.log(this.urlBase + 'verVideo?idencuesta='+idEncuesta);
    return this.http
      .get(this.urlBase + 'verVideo?idencuesta='+idEncuesta)
      .toPromise()
      .then( res =>{
        return res
      })
  }

  callPost(objRespuesta) {
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
