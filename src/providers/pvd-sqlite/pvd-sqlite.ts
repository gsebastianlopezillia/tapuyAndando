import { Injectable } from '@angular/core';
import { PvdHttpProvider } from '../../providers/pvd-http/pvd-http';

import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  ORIGEN 
  https://github.com/kiranchenna/ionic-2-native-sqlite/blob/master/src/providers/data-base.ts
*/
@Injectable()
export class PvdSqliteProvider {
  private options = { name: "tapuy.db", location: 'default' };
  private queryCreateTableRespuestas = 'create table if not exists respuestas(idRespuesta INTEGER PRIMARY KEY AUTOINCREMENT, respuesta)';

  dbTapuy: SQLiteObject;

  constructor(public http: PvdHttpProvider, private sqlite: SQLite) {
    this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        console.log('********Inicializa sqlite*********');
        this.dbTapuy = db;
      })
  }

  crearBase() {
    return this.dbTapuy.executeSql(this.queryCreateTableRespuestas, [])
      .then(() => {//crea tabla respuestas
        return console.log('**Tabla creada con éxito**');
      })
  }

  insertRespuesta(respuesta) {
    console.log('respuesta en el servicio');
    console.log(respuesta);
    let insertQuery = 'INSERT INTO respuestas(respuesta) VALUES(?)';
    return this.dbTapuy.executeSql(insertQuery, [respuesta]).then(res => {
      if (res.rowsAffected == 0) {
        Promise.reject('**ERR - INSERT RESPUESTA**');
      }
      console.log('inserto en base:');
      console.log(res);
    })
  }

  getPrimerRespuesta() {
    let postQuery2 = "SELECT * FROM respuestas WHERE idRespuesta IN (SELECT MIN(idRespuesta) FROM respuestas)";
    return this.dbTapuy.executeSql(postQuery2, [])
      .then(respuesta => {
        return respuesta;
      },
      err=>{
        console.log('error getPrimerRespuesta')
        console.log(err);
      })
  }

  enviarRespuesta(respuesta) {
    return this.http.callPost(respuesta)
      .then(llego => {
        //console.log('respuesta servidor:');
        console.log(llego.respuesta);
        return llego;
      },
      err=>{
        console.log('error enviarRespuesta')
        console.log(err);
      })
  }

  deletePrimerRespuesta() {
    let deleteQuery = 'DELETE FROM respuestas WHERE idRespuesta in (SELECT MIN(idRespuesta) FROM respuestas)';
    return this.dbTapuy.executeSql(deleteQuery, [])
      .then(res => {
        //console.log('respuestas borradas');
        //console.log(res.rowsAffected);
        console.log('Borro '+res.rowsAffected+ 'respuesta.');
        return res;
      },
      err=>{
        console.log('error deletePrimerRespuesta')
        console.log(err);
      })
  }

  sincroniza() {
    let countQuery = 'SELECT COUNT(idRespuesta) cant FROM respuestas';
    let mando = false;
    return Promise.all([this.getPrimerRespuesta()])
      .then(respuesta => {
        return Promise.all([this.enviarRespuesta(respuesta[0].rows.item(0)), this.dbTapuy.executeSql(countQuery, [])])
          .then(llego => {
            if (llego[0].respuesta) {
              this.deletePrimerRespuesta()
            }
            return llego[1].rows.item(0).cant;
          })
      })
  }

  count(){
    let countQuery = 'SELECT COUNT(idRespuesta) cant FROM respuestas';
    return this.dbTapuy.executeSql(countQuery, [])
    .then(res =>{return res.rows.item(0).cant})
  }
}
