import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Modules
import { BookingModule } from '../booking/booking.module';
import { CarouselModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module'
// components
import { IndexHomeComponent } from './index/index.component';
import { HomeNewComponent } from './home-new/home-new.component'

@NgModule({
  imports: [
    CommonModule,
    BookingModule,
    CarouselModule.forRoot(),
    SharedModule
  ],
  declarations: [IndexHomeComponent, HomeNewComponent]
})
export class HomeModule { }
