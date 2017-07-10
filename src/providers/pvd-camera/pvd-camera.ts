import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';

import 'rxjs/add/operator/map';

/*
  Generated class for the PvdCameraProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PvdCameraProvider {

  picture: string = '';

  private pictureOpts: CameraPreviewPictureOptions = {
    width: 1000,
    height: 1000,
    quality: 10
  };
  // camera options (Size and location). In the following example, the preview
  // uses the rear camera and display the preview in the back of the webview
  private cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
    camera: 'front',
    tapPhoto: false,
    previewDrag: false,
    toBack: true,
    alpha: 1
  };

  constructor(public http: Http, public cameraPreview: CameraPreview) {

  }

  getPicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
      return this.picture;
    }, (err) => {
      console.log('Fail take: ' + err);
    });
  }

  openCamera() {
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => { console.log('camSuccess') },
      (err) => { console.log('camFail: ' + err); }
    );
  }

  closeCamera() {
    this.cameraPreview.stopCamera().then(
      (res) => { console.log('closeCamSuccess') },
      (err) => { console.log('closeCamFail: ' + err); }
    );
  }

}
