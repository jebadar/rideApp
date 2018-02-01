import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BannerService } from '../../shared/banner-service/banner.service'

@Component({
  selector: 'app-payment-component',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  assetsUrl = Constants.ASSET_URL;

  quoteDetail;

  loading = false;

  constructor(
    private bookingService:BookingService,
    private router:Router,
    private toastr:ToastsManager,
    private bannerService: BannerService
  ) { }

  ngOnInit() {
    setTimeout(() => { this.bannerService.setTitle("payment"); }, 0);    
    this.quoteDetail = this.bookingService.getLocalQuote().temp;
    // this.checkObject(this.quoteDetail);
  }
  checkObject(routeObj) {
    if (this.bookingService.isEmptyObject(routeObj)) {
      this.router.navigate([''])
    } else {
      if (routeObj.customer_id === null || routeObj.car_type_id === null) {
        this.router.navigate([''])
        } else {
      }
    }
  }
  selectPayment(paymentId){
    this.quoteDetail.payment_mode = paymentId
  }
  submit() {
    if(this.quoteDetail.payment_mode == null) {
      this.toastr.warning('Payment mode is not selected, Please select any.', null);
    } else {
      this.submitQuote();
    }
  }
  submitQuote() {
    this.loading = true;
    this.quoteDetail.date = this.bookingService.convertDate(this.quoteDetail.date);
    this.quoteDetail.time = this.bookingService.convertTime('summary',this.quoteDetail.time);
    this.quoteDetail.routes = this.quoteDetail.bookingroutes
    this.bookingService.updateQuote(this.quoteDetail)
      .subscribe(data => {
        this.loading = false;
        const res = data.json()
        this.bookingService.setLocalQuote(res[0])
        this.toastr.success('Ride Booked Successfully')
      }, error => {
        this.loading = false;
        this.toastr.error('Error in booking ride,Try Again', null);
      })
  }
}
