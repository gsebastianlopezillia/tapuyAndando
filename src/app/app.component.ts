import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { PvdSqliteProvider } from '../providers/pvd-sqlite/pvd-sqlite';
import { PvdCameraProvider } from '../providers/pvd-camera/pvd-camera';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    fullScreen: AndroidFullScreen,
    sqlite: PvdSqliteProvider,
    camera: PvdCameraProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      sqlite.crearBase();
      statusBar.hide();
      fullScreen.immersiveMode();
      splashScreen.hide();
      camera.openCamera();
    });
  }

}

