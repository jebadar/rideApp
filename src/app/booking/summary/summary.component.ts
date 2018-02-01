import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '../../constants';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';
import { RouterEvent } from '@angular/router/src/events';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['../../layout/index/index.component.css']
})
export class SummaryComponent implements OnInit {
  @ViewChild('scrollToDiv') scrollDiv;

  assetsUrl = Constants.ASSET_URL;

  quoteDetail: any = {};
  pickupDetail;

  date;

  constructor(private bookingService: BookingService,
    private router: Router) { }

  ngOnInit() {
    this.quoteDetail = this.bookingService.getLocalQuote().temp;
    this.checkObject(this.quoteDetail);
    this.scrollDiv.nativeElement.scrollIntoView(true)
  }
  checkObject(routeObj) {
    if (this.bookingService.isEmptyObject(routeObj)) {
      this.router.navigate([''])
    } else {
      if (routeObj.customer_id === null || routeObj.car_type_id === null) {
        this.router.navigate([''])
      } else {
        this.pickupDetail = JSON.parse(this.quoteDetail.pickup_details);
        this.date  = this.bookingService.convertTime('summary',this.quoteDetail.time);
      }
    }
  }
  next() {
    this.router.navigate(['payment'])
  }
  back() {
    this.router.navigate(['passengers'])
  }

}
