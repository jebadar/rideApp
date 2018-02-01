import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../constants';
import { Router } from '@angular/router';
import { BookingService } from '../booking.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-quote-navigate-component',
  templateUrl: './quote-navigate.component.html',
  styleUrls: ['../../layout/index/index.component.css']
})
export class QuoteNavigateComponent implements OnInit {
  @Input() currentStage;

  assetsUrl = Constants.ASSET_URL;

  quoteDetail: any = {};

  enableResponsive = false;

  constructor( private router: Router,
    private bookingService: BookingService,
    private toastr: ToastsManager) { }

  ngOnInit() {
    this.quoteDetail = this.bookingService.getLocalQuote().temp;
    this.enableResponsive = this.bookingService.detectResponsive();
  }
  checkObject(key, routeObj) {
    if (key === 'payment' || key === 'summary' || key === 'passengers') {
      if (this.quoteDetail.car_type_id === null ) {
        this.toastr.warning('Please provide booking details first', null);
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }
  navigate(key) {
    if (key !== this.currentStage) {
      if (this.checkObject(key, this.quoteDetail)) {
        this.router.navigate([key])
      }
    }
  }
}
