import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// components
import { PickupMainComponent } from './pickup-main/pickup-main.component';
import { QuoteComponent } from './quote/quote.component';
import { VehiclePassengerComponent } from './vehicle-passenger/vehicle-passenger.component';
import { SummaryComponent } from './summary/summary.component'
import { PaymentComponent } from './payment/payment.component';
import { QuoteNavigateComponent } from './quote-navigate/quote-navigate.component';
import { PickupMainNewComponent } from './pickup-main-new/pickup-main-new.component';
import { CarsPassengerComponent } from './cars-passenger/cars-passenger.component';
import { QuoteNewComponent } from './quote-new/quote-new.component';
import { SummaryNewComponent } from './summary-new/summary-new.component';
import { AutoConfirmPopupComponent } from './auto-confirm-popup/auto-confirm-popup.component';
// app modules
import { BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// local modules
import { SharedModule } from '../shared/shared.module'
import { DirecDirective } from '../shared/direc-directive';
import { UsersModule } from '../users/users.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    SharedModule,
    UsersModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ],
  declarations: [
    PickupMainComponent,
    QuoteComponent,
    VehiclePassengerComponent,
    SummaryComponent, 
    PaymentComponent, 
    QuoteNavigateComponent, 
    PickupMainNewComponent, 
    CarsPassengerComponent, 
    QuoteNewComponent, 
    SummaryNewComponent, 
    AutoConfirmPopupComponent
  ],
  exports: [ PickupMainComponent, PickupMainNewComponent ],
  providers: [DirecDirective]
})
export class BookingModule { }
