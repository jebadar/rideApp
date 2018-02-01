import { Component, OnInit, ElementRef, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BookingService } from '../booking.service';
import { BsDropdownModule } from 'ngx-bootstrap';
import { } from 'googlemaps';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Constants } from '../../constants';

@Component({
  selector: 'app-pickup-main-new-component',
  templateUrl: './pickup-main-new.component.html',
  styleUrls: ['./pickup-main-new.component.css']
})
export class PickupMainNewComponent implements OnInit {
  assetsUrl = Constants.ASSET_URL;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  Arr = Array;

  typesObj;
  reserveObj: any = {};
  first_loc: any = {};
  second_loc: any = {};
  timeSettings:any = {};

  _quoteData: quoteData = {
    date: null,
    return_trip: "",
    wait_hour: 0,
    wait_minutes: 0,
    return_date:null
  }

  loading = false;

  constructor(private bookingService: BookingService,
    private router: Router,
    private toastr: ToastsManager
  ) { }
  ngOnInit() {
    this.fetchLocationType();
    this.fetchSettings();
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
  fetchSettings() {
    this.loading = true;
    this.bookingService.getSetting()
      .subscribe(data => {
        this.timeSettings = data;
        this.timeSettings = this.timeSettings.settings;
        this.timeSettings = this.timeSettings.filter(x => x.name === "Minimum Booking Time");
        this.timeSettings = this.timeSettings[0]
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
  initFields() {
    let arr:any = []
    if(this.first_loc.fields.length > 0) {
      this.first_loc.fields.forEach(item => {
        arr.push({field_id:item.field_id, value:''})
      });
    }
    return arr;
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
    if (this.reserveObj.from === "") {
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
        if (this.validate()) {
          this.createQuote();
        }
      }
    } else {
      this.toastr.warning(
        'Form is invalid, both locations are required.',
        null,
        {
          tapToDismiss: true,
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
    const quote: quote = this.initQuote();
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
  initQuote() {
    let temp: Array<any> = []
    temp.push({
      from: this.reserveObj.from.formatted_address,
      to: this.reserveObj.to.formatted_address,
      diversion_sequence: 1
    })
    const tempQuote: quote = {
      confirm: '0',
      return_trip: this._quoteData.return_trip,
      waiting_time: (Number(this._quoteData.wait_hour) * 60 + Number(this._quoteData.wait_minutes)).toString(),
      time: this.bookingService.generateTime(this._quoteData.date,this._quoteData.date.getHours() , this._quoteData.date.getMinutes()),
      returnTime:this._quoteData.return_trip === 'return_journey' ? this.bookingService.generateTime(this._quoteData.return_date,this._quoteData.return_date.getHours(),this._quoteData.return_date.getMinutes()) : 0,
      routes: temp,
      fields:this.initFields()
    };
    return tempQuote;
  }
  validateLocation() {
    if (this.reserveObj.from.formatted_address === this.reserveObj.to.formatted_address) {
      this.toastr.warning(
        'Both locations cannot be same, Please select different locations.',
        null,
        {
          tapToDismiss: true,
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
  setJourneyType(value) {
    this._quoteData.return_trip = value;
  }
  validateDate(timeSetting,date, key) {    
    if (date !== "") {
      let d1 = date;
      let hour = d1.getHours();
      let minutes = d1.getMinutes();
      let d2
      let errorMessage = '';
      if(key === 'date') {
        d2 = new Date();
        d2.setMilliseconds( d2.getMilliseconds() + timeSetting*3600*1000);
        errorMessage = 'You can only book a ride after '+
        d2.getFullYear()+'-'+(d2.getMonth()+1)+'-'+d2.getDate()+' '+d2.getHours()+':'+d2.getMinutes()
      } else if(key === 'Return Date') {
        d2 = new Date(timeSetting*1000);
        errorMessage = 'You can only set Return Date and Time after '+
        d2.getFullYear()+'-'+(d2.getMonth()+1)+'-'+d2.getDate()+' '+d2.getHours()+':'+d2.getMinutes()
      }
      if (d1.getFullYear() >= d2.getFullYear() &&
        d1.getMonth() >= d2.getMonth() &&
        d1.getDate() > d2.getDate()) {
        return false;
      } else if(d1.getFullYear() >= d2.getFullYear() &&
        d1.getMonth() > d2.getMonth()){
          return false;
      } else if (d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()) {
          const h = d2.getHours()
          const m = d2.getMinutes();
        if (
          hour > h ) {
            return false;
        } else if( hour == h && minutes >= m) {
          return false;
        }
         else {
          this.toastr.warning(errorMessage, null)
          return true;
        }
      } else {
        this.toastr.warning(errorMessage, null)
        return true;
      }
    } else if (date === "") {
      this.toastr.warning('Please provide '+ key + ' of journey. Date must be valid.', null)
      return true;
    }
    return true
  }
  validate() {
    if (this._quoteData.return_trip === "") {
      this.toastr.warning('Please provide trip type.', null)
      return false;
    } else if (this._quoteData.date === null) {
      this.toastr.warning('Please provide date of booking', null)
      return false;
    } else if (this.validateDate(this.timeSettings.value,this._quoteData.date,'date')) {
      return false;
    } else if (this._quoteData.return_trip === 'waiting_return_journey') {
      if ((Number(this._quoteData.wait_hour) + Number(this._quoteData.wait_minutes)) <= 0) {
        this.toastr.warning('Please provide estimated waiting time.', null)
        return false
      } else if (this._quoteData.wait_hour.toString() === '' || this._quoteData.wait_minutes.toString() === '') {
        this.toastr.warning('Please provide valid waiting time.', null);
        return false;
      }
    }
    if(this._quoteData.return_trip === 'return_journey') {
       if (this._quoteData.return_date === null) {
        this.toastr.warning('Please provide return date of booking', null)
        return false;
      } else if (this.validateDate(this.bookingService.generateTime(this._quoteData.date,this._quoteData.date.getHours() , this._quoteData.date.getMinutes()), this._quoteData.return_date,'Return Date')) {
        return false;
      }
    }
    return true;
  }
}

interface quote {
  routes: Array<any>,
  confirm: string,
  return_trip: string,
  waiting_time: string,
  time: number,
  returnTime: number,
  fields:Array<any>
}
interface quoteData {
  date: Date,
  return_trip: string,
  wait_hour: number,
  wait_minutes: number,
  return_date:Date,
}