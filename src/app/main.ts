import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PvdCameraProvider } from '../providers/pvd-camera/pvd-camera';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule, [PvdCameraProvider]);
