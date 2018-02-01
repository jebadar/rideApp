import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../shared/banner-service/banner.service'
@Component({
  selector: 'app-banner-box-component',
  templateUrl: './banner-box.component.html',
  styleUrls: ['./banner-box.component.css']
})
export class BannerBoxComponent implements OnInit {

  state = "home";
  heading = "";
  detail = "";  
  constructor(
    private bannerService: BannerService
  ) { }
  ngOnInit() {
    this.updateState = this.updateState.bind(this);
    this.bannerService.changeEmitted$.subscribe(this.updateState);
  }
  updateState(title) {
    this.state = title;
    this.changeText(title)
  }
  changeText(title) {
    if(title === 'passengers') {
      this.heading = "DETAILS";
      this.detail = "There are many variations of passages of Lorem Ipsum";
    } else if(title === 'quote') {
      this.heading = "Your quote";
      this.detail = "Get a quote for your journey & select your option of comfort with our fleet.";
    } else if(title === 'summary') {
      this.heading = "Trip Detail";
      this.detail = "Summarise your booking details for your journey.";
    } else if(title === 'payment') {
      this.heading = "Payment";
      this.detail = "Choose a payment method to complete your booking.";
    } else if( title==="profile") {
      this.detail = "Profile & Booking";
    }
  }
}
