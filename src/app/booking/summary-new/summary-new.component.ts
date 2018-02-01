import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerService } from '../../shared/banner-service/banner.service'
import { Constants } from '../../constants';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';
import { RouterEvent } from '@angular/router/src/events';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UserService } from '../../users/user.service'

@Component({
  selector: 'app-summary-new-component',
  templateUrl: './summary-new.component.html',
  styleUrls: ['./summary-new.component.css']
})
export class SummaryNewComponent implements OnInit {
  @ViewChild('scrollToDiv') scrollDiv;

  assetsUrl = Constants.ASSET_URL;

  quoteDetail: any = {};
  unitSettings:any = {};
  autoConfirmSettings:any = {};
  pickupDetail;
  user:any = {};

  enableAutoBox = false;
  loading_next = false;
  enablePaymentBox = false;
  date;

  constructor(private bookingService: BookingService,
    private router: Router,
    private bannerService: BannerService,
    private userService:UserService
  ) { }

  ngOnInit() {
    setTimeout(() => { this.bannerService.setTitle("summary"); }, 0); 
    this.fetchSettings(); 
    this.user = this.userService.getLoggedInUser(); 
    this.closeBox = this.closeBox.bind(this); 
    this.quoteDetail = this.bookingService.getLocalQuote().temp;
    this.checkObject(this.quoteDetail);
    this.scrollDiv.nativeElement.scrollIntoView(true)
  }
  fetchSettings() {
    this.bookingService.getSetting()
      .subscribe(data => {
        this.unitSettings = data;
        this.unitSettings = this.unitSettings.settings;
        this.autoConfirmSettings = this.unitSettings.filter(x => x.name === "Auto Confirmation");
        this.unitSettings = this.unitSettings.filter(x => x.name === "Currency Unit");
        this.unitSettings = this.unitSettings[0]
      }, error => {
      })
  }
  checkObject(routeObj) {
    if (this.bookingService.isEmptyObject(routeObj)) {
      this.router.navigate([''])
    } else {
      if (routeObj.car_type_id === null) {
        this.router.navigate([''])
      } else {
        this.pickupDetail = JSON.parse(this.quoteDetail.pickup_details);
        this.quoteDetail.customer = this.user;
        this.date  = this.bookingService.convertTime('summary',this.quoteDetail.time);
      }
    }
  }
  next() {
    if(this.autoConfirmSettings[0].value === "no") {
      this.enableAutoBox = true;
    } else {
      this.router.navigate(['profile'])
    }
  }
  updateQuote() {
    this.loading_next = true;
    this.quoteDetail.routes = this.quoteDetail.bookingroutes;
    this.quoteDetail.confirm = "1";
    this.quoteDetail.childseats = this.childSeats(this.quoteDetail.childseats);
    this.bookingService.updateQuote(this.quoteDetail)
      .subscribe(data => {
        this.loading_next = false;
        const res = data.json()[0];
        if(res.quotes && res.quotes.length) {
          this.enablePaymentBox = true;
        } else {
          this.enableAutoBox = true;
        }
      }, error => {
        this.loading_next = false;
        // this.toastr.error('Error in booking ride,Try Again', null);
      })
  }
  childSeats(seatArr) {
    let arr = [];
    seatArr.forEach(item => {
      arr.push(item.seat_id)
    });
    return arr;
  }
  closeBox() {
    if(this.enableAutoBox) {
      this.enableAutoBox = false; 
      this.router.navigate(['profile'])
    } else if(this.enablePaymentBox) {
      this.enablePaymentBox = false;
      this.router.navigate(['payment'])
    }
  }
  back() {
    this.router.navigate(['passengers'])
  }

}
