import { Component, OnInit, ElementRef, NgZone, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BookingService } from '../booking.service';
import { BsDropdownModule } from 'ngx-bootstrap';
import { } from 'googlemaps';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-pickup-main-component',
  templateUrl: './pickup-main.component.html',
  styleUrls: ['../../layout/index/index.component.css']
})
export class PickupMainComponent implements OnInit {

  typesObj;
  reserveObj: any = {};
  first_loc: any = {};
  second_loc: any = {};

  loading = false;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor( private bookingService: BookingService,
  private router: Router,
  private toastr: ToastsManager
 ) { }
  ngOnInit() {
    this.fetchLocationType()
    this.set = this.set.bind(this)
    this.first_loc.description = ''
    this.second_loc.description = '';
    this.reserveObj.to = "";
    this.reserveObj.from = "";
  }
  fetchLocationType() {
    this.loading = true;
    this.bookingService.getLocationType()
    .subscribe(data => {
      this.typesObj = data.json().locationtype;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }
  initLocation(key, counter) {
    if (key === 1) {
      this.first_loc = this.typesObj[counter]
    } else if (key === 2) {
      this.second_loc = this.typesObj[counter]
    }
  }
  selectLoc(key, counter) {
    if (key === 1) {
      const tempObj: any = {};
      tempObj.formatted_address = this.first_loc.locations[counter].google_map_friendly_name;
      this.reserveObj.from = tempObj;
    } else if (key === 2) {
      const tempObj: any = {};
      tempObj.formatted_address = this.second_loc.locations[counter].google_map_friendly_name
      this.reserveObj.to = tempObj;
    }
  }
  selectedStatus() {
    if(this.reserveObj.from === "") {
      return '1'
    } else if (this.reserveObj.to === "") {
      return '2'
    } else {
      return 'both'
    }
  }
  reserveNow() {
    if (this.selectedStatus() === 'both') {
      if (this.validateLocation()) {
        this.createQuote();
      }
    } else {
      this.toastr.warning(
        'Form is invalid, both locations are required.',
        null,
        { tapToDismiss: true ,
          closeButton: true,
          showDuration: 300,
          hideDuration: 1000,
          timeOut: 5000,
          extendedTimeOut: 1000,
          showCloseButton: true
        }
      );
    }
  }
  createQuote() {
    const quote: any = {};
    quote.routes = []
    quote.confirm = '0'
      quote.routes.push({
        from: this.reserveObj.from.formatted_address,
        to: this.reserveObj.to.formatted_address,
        diversion_sequence: 1
    })
    this.loading = true;
    this.bookingService.createQuote(quote)
    .subscribe(data => {
      const res = data.json()[0];
      this.loading = false;
      this.router.navigate(['quote'])
    }, error => {
      this.loading = false;
    })
  }
  set(key, value) {
    if (key === 1) {
      this.reserveObj.from = value;
    } else if (key === 2) {
      this.reserveObj.to = value;
    }
  }
  validateLocation() {
    if (this.reserveObj.from.formatted_address === this.reserveObj.to.formatted_address) {
      this.toastr.warning(
        'Both locations cannot be same, Please select different locations.',
        null,
        { tapToDismiss: true ,
          closeButton: true,
          showDuration: 300,
          hideDuration: 1000,
          timeOut: 5000,
          extendedTimeOut: 1000,
          showCloseButton: true
        }
      );
      return false;
    } else {
      return true;
    }
  }
}
