import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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
  private sincroFlag: boolean = false;

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
        return Promise.resolve(console.log('**Tabla creada con éxito**'));
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

  sincroniza() {
    if (!this.sincroFlag) {
      this.sincroFlag = true;
      let postQuery = "SELECT * FROM respuestas WHERE idRespuesta IN (SELECT MIN(idRespuesta) FROM respuestas)";
      console.log('entra a sincroniza');
      return this.dbTapuy.executeSql(postQuery, [])
        .then(res => {
          console.log('ejecuta el select');
          let resVieja = res.rows.item(0);
          console.log('resVieja');
          console.log(resVieja);
          if (resVieja != undefined) {
            this.http.callPost3(resVieja)
              .then(res2 => {
                console.log('res de la llamada al post de sinc');
                console.log(res2);
                if (JSON.parse(JSON.stringify(res2)).respuesta) {
                  console.log('entro al if');
                  let deleteQuery = 'DELETE FROM respuestas WHERE idRespuesta in (SELECT MIN(idRespuesta) FROM respuestas)';
                  this.dbTapuy.executeSql(deleteQuery, [])
                    .then(() => {
                      console.log('borro');
                      this.sincroFlag = false;
                    });
                }else{
                  this.sincroFlag = false;
                }
              })
          } else {
            console.log('base vacia');
            this.sincroFlag = false;
          }
        }).catch(e => {
          this.sincroFlag = false;
          console.log('e');
          console.log(e);
        })
    }else{
      console.log('Flag activa');
    }

  }
}
