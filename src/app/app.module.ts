import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CameraPreview } from '@ionic-native/camera-preview';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device'
import { AndroidFullScreen } from '@ionic-native/android-full-screen'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { PvdCameraProvider } from '../providers/pvd-camera/pvd-camera';
import { PvdDeviceProvider } from '../providers/pvd-device/pvd-device';
import { PvdHttpProvider } from '../providers/pvd-http/pvd-http';
import { PvdStorageProvider } from '../providers/pvd-storage/pvd-storage';
import { PvdSqliteProvider } from '../providers/pvd-sqlite/pvd-sqlite';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    NativeStorage,
    SQLite, 
    Device,
    AndroidFullScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PvdCameraProvider,
    PvdDeviceProvider,
    PvdHttpProvider,
    PvdStorageProvider,
    PvdSqliteProvider,
  ]
})
export class AppModule {}
