import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// app modules
import { AgmCoreModule } from '@agm/core';
// components
import { GoogleMapComponent } from './google-map/google-map.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { LoaderComponent } from './loader/loader.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
// direcrives
import { DirecDirective } from './direc-directive';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtwNU2dy4Dl0sbuKB7u1SKJarbI33Byx4',
      libraries: ['places'],
      region: 'uk'
    })
  ],
  declarations: [GoogleMapComponent,
    AutoCompleteComponent,
    DirecDirective,
    LoaderComponent,
    ConfirmPopupComponent
  ],
    exports: [ AutoCompleteComponent, GoogleMapComponent, DirecDirective,
      LoaderComponent,
      ConfirmPopupComponent ]
})
export class SharedModule { }
