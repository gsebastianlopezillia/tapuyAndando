import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CameraPreview } from '@ionic-native/camera-preview';
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { SQLite } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device'
import { AndroidFullScreen } from '@ionic-native/android-full-screen'
import { Network } from '@ionic-native/network';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer'
import { File } from '@ionic-native/file'
import { VideoPlayer } from '@ionic-native/video-player'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { PvdCameraProvider } from '../providers/pvd-camera/pvd-camera';
import { PvdDeviceProvider } from '../providers/pvd-device/pvd-device';
import { PvdHttpProvider } from '../providers/pvd-http/pvd-http';
import { PvdStorageProvider } from '../providers/pvd-storage/pvd-storage';
import { PvdSqliteProvider } from '../providers/pvd-sqlite/pvd-sqlite';

import { GraciasPage } from '../pages/gracias/gracias'
import { PreguntaPage } from '../pages/pregunta/pregunta'
import { SincroPage } from '../pages/sincro/sincro'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GraciasPage,
    PreguntaPage,
    SincroPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GraciasPage,
    PreguntaPage,
    SincroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    NativeStorage,
    SQLite, 
    Device,
    AndroidFullScreen,
    PvdCameraProvider,
    PvdDeviceProvider,
    PvdHttpProvider,
    PvdStorageProvider,
    PvdSqliteProvider,
    Network,
    FileTransfer,
    FileTransferObject,
    File,
    VideoPlayer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
