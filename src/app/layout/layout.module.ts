import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// components
import { PublicComponent } from './public/public.component';
import { IndexComponent } from './index/index.component';
// modules
import { AppRoutingModule } from '../app-routing/app-routing.module';
import { UsersModule } from '../users/users.module';
import { CollapseModule } from 'ngx-bootstrap';
import { IndexNewComponent } from './index-new/index-new.component';
import { BannerBoxComponent } from './banner-box/banner-box.component'
import { BookingModule } from '../booking/booking.module';
// services
import { BannerService } from '../shared/banner-service/banner.service'

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    UsersModule,
    CollapseModule,
    BookingModule
  ],
  declarations: [ PublicComponent, IndexComponent, IndexNewComponent, BannerBoxComponent ],
  providers: [ BannerService ]
})
export class LayoutModule { }
