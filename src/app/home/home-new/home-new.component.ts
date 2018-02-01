import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';
// services
import { BannerService } from '../../shared/banner-service/banner.service'
import { BookingService } from '../../booking/booking.service'
// loader
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-home-new',
  templateUrl: './home-new.component.html',
  styleUrls: ['../../layout/index-new/index-new.component.css']
})
export class HomeNewComponent implements OnInit {
  assetsUrl = Constants.ASSET_URL;

  status = 0;

  cars:any = [];

  loadCars = false;

  constructor(
    private bannerService:BannerService,
    private bookingService:BookingService
  ) { }

  ngOnInit() {
    setTimeout(()=>{this.bannerService.setTitle("home");},0);
    this.fetchCars();
  }
  fetchCars() {
    this.loadCars = true
    this.bookingService.getCars()
      .subscribe(data => {
        this.loadCars = false;
        this.cars = data.json().cartypes;
      }, error => {
        this.loadCars = false;
      })
  }
  changeStatus(num) {
    this.status =  num;
  }
}
