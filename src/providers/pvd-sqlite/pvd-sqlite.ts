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
        //console.log('********Inicializa sqlite*********');
        this.dbTapuy = db;
      })
      .then(() => {
        this.crearBase();
      })
  }

  crearBase() {
    return this.dbTapuy.executeSql(this.queryCreateTableRespuestas, [])
      .then(() => {//crea tabla respuestas
        return true //console.log('**Tabla creada con éxito**');
      })
  }

  insertRespuesta(respuesta) {
    let insertQuery = 'INSERT INTO respuestas(respuesta) VALUES(?)';
    return this.dbTapuy.executeSql(insertQuery, [respuesta]).then(res => {
      if (res.rowsAffected == 0) {
        Promise.reject('**ERR - INSERT RESPUESTA**');
      }
      return res.rowsAffected
    })
  }

  getPrimerRespuesta() {
    let postQuery2 = "SELECT respuesta FROM respuestas WHERE idRespuesta IN (SELECT MIN(idRespuesta) FROM respuestas)";
    return this.dbTapuy.executeSql(postQuery2, [])
      .then(respuesta => {
        return respuesta;
      },
      err=>{
        return err
      })
  }

  enviarRespuesta(respuesta) {
    return this.http.callPost(respuesta)
      .then(llego => {
        return llego;
      },
      err=>{
        return err
      })
  }

  deletePrimerRespuesta() {
    let deleteQuery = 'DELETE FROM respuestas WHERE idRespuesta in (SELECT MIN(idRespuesta) FROM respuestas)';
    return this.dbTapuy.executeSql(deleteQuery, [])
      .then(res => {
        return res;
      },
      err=>{
        return err
      })
  }

  sincroniza() {
    let mando = false;
    return this.getPrimerRespuesta()
      .then(respuesta => {
        return this.enviarRespuesta(respuesta.rows.item(0))
          .then(res => {
            if (res.respuesta) {
              this.deletePrimerRespuesta()
            }
            return res
          })
      })
  }

  count(){
    let countQuery = 'SELECT COUNT(idRespuesta) cant FROM respuestas';
    return this.dbTapuy.executeSql(countQuery, [])
    .then(res =>{
      return res.rows.item(0).cant})
  }
}
