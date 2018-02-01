import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { BannerService } from '../../shared/banner-service/banner.service'
import { FormControl } from '@angular/forms';
import { Constants } from '../../constants';
import { BookingService } from '../booking.service';
import { DirecDirective } from '../../shared/direc-directive';
import { GoogleMapComponent } from '../../shared/google-map/google-map.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CanDeactivateGuard } from '../../app-routing/can-deactivate.guard'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-quote-new-component',
  templateUrl: './quote-new.component.html',
  styleUrls: ['./quote-new.component.css']
})
export class QuoteNewComponent implements OnInit, CanDeactivateGuard {
  @ViewChild('scrollToDiv') scrollDiv;

  assetsUrl = Constants.ASSET_URL;
  // flags
  loading = false;
  load_types = false;
  enableResponsive = false;
  loadCars = false;
  loading_next = false;
  enablePopup = false;
  // objects
  waypoints: any = [];
  locArray = [];
  routeMapArray = [];
  changeFunc: any = {
    update: null
  };
  quoteObj: any = {};
  location: any = {};
  cars: Array<any> = [];
  unitSettings: any = {};
  timeSettings: any = {};
  returnTime: time = {
    date: new Date()
  }
  bookingTime: time = {
    date: null
  }
  // variables
  startLoc;
  endLoc;
  positionSet = '';
  tempAddress: any = null;
  typesObj;
  insertAfter = null;
  selectedCarId;
  // Subject Observable
  deactivateSubject;

  constructor(
    private bannerService: BannerService,
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastsManager
  ) { }

  ngOnInit() {
    setTimeout(() => { this.bannerService.setTitle("quote"); }, 0);
    this.fetchCars();
    this.fetchSettings();
    this.quoteObj = this.bookingService.getLocalQuote().temp;
    this.initDate();
    this.initReturnDate();
    this.enableResponsive = this.bookingService.detectResponsive();
    this.fetchLocationType();
    this.location.description = '';
    this.set = this.set.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.scrollDiv.nativeElement.scrollIntoView(true);
    this.checkObject(this.quoteObj)
  }
  ngOnDestroy() {
  }
  // Fetch Object Area Starts
  initDate() {
    this.bookingTime.date = new Date(this.quoteObj.time * 1000);
  }
  initReturnDate() {
    if (Number(this.quoteObj.returnTime) > 0) {
      this.returnTime.date = new Date(this.quoteObj.returnTime * 1000);
    } else {
      this.returnTime.date = new Date();
    }
  }
  fetchSettings() {
    this.loading = true;
    this.bookingService.getSetting()
      .subscribe(data => {
        let Settings: any = data
        Settings = Settings.settings;
        this.unitSettings = Settings.filter(x => x.name === "Distance Unit");
        this.unitSettings = this.unitSettings[0]
        this.timeSettings = Settings.filter(x => x.name === "Minimum Booking Time");
        this.timeSettings = this.timeSettings[0]
        this.loading = false;
      }, error => {
        this.loading = false;
      })
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
  fetchLocationType() {
    this.load_types = true;
    this.bookingService.getLocationType()
      .subscribe(data => {
        this.typesObj = data.json().locationtype;
        this.load_types = false;
      }, error => {
        this.load_types = false;
      })
  }
  // Fetch Object Area ends

  // Object Initialziation Starts
  checkObject(routeObj) {
    if (this.bookingService.isEmptyObject(routeObj)) {
      this.router.navigate([''])
    } else {
      this.routeMapArray = this.quoteObj.bookingroutes
      if (this.quoteObj.return_trip === 'waiting_return_journey') {
        this.quoteObj.wait_hour = this.quoteObj.waiting_time / 60;
        this.quoteObj.wait_hour = ~~this.quoteObj.wait_hour;
        this.quoteObj.wait_minutes = this.quoteObj.waiting_time - (this.quoteObj.wait_hour * 60);
      } else {
        this.quoteObj.wait_hour = '';
        this.quoteObj.wait_minutes = '';
      }
      if (this.quoteObj.car_type_id !== null || this.quoteObj.car_type_id !== "") {
        this.selectedCarId = this.quoteObj.car_type_id;
      }
      this.quoteObj.childseats = [];
      this.initLocArray(this.quoteObj.bookingroutes);
      this.initWaypoints(this.quoteObj.bookingroutes)
    }
  }
  initLocArray(_routes) {
    this.locArray = [];
    _routes.forEach((item, index) => {
      if (index === _routes.length - 1) {
        this.locArray.push(item.to);
        this.locArray.push(item.from);
      } else {
        this.locArray.push(item.from);
      }
    });
  }
  initLocation(counter) {
    this.location = Object.assign({}, this.typesObj[counter]);
  }
  initWaypoints(_routes) {
    this.startLoc = _routes[0].from;
    this.endLoc = _routes[_routes.length - 1].to;
    this.waypoints = [];
    if (_routes.length > 1) {
      _routes.forEach((item, index) => {
        if (index <= _routes.length - 1 && index > 0) {
          let temp: any = {};
          temp.formatted_address = item.from;
          this.waypoints.push(temp);
        }
      });
    }
    if (this.changeFunc.update != undefined) {
      this.changeFunc.update(this.startLoc, this.endLoc, this.waypoints);
    }
  }
  generateWaypoints(_new, _after, _start, _end, _waypoints) {
    let objectLocation: any = {};
    objectLocation.start = _start;
    objectLocation.end = _end;
    objectLocation.waypoints = _waypoints;
    if (_start === _after) {
      objectLocation.waypoints.push(_new);
    } else if (_end === _after) {
      const tempChild: any = {};
      tempChild.formatted_address = _end;
      objectLocation.waypoints.splice(_waypoints.length, 0, tempChild);
      objectLocation.end = _new.formatted_address;
    } else {
      _waypoints.forEach((item, index) => {
        if (item.formatted_address === _after) {
          objectLocation.waypoints.splice(index + 1, 0, _new);
        }
      });
    }
    return objectLocation;
  }
  generateRoutes(_start, _end, _waypoints) {
    const _routeArray = [];
    let indexOfDiversion = 1;
    if (_waypoints.length < 1) {
      if (_start !== undefined && _end !== undefined) {
        _routeArray.push({
          from: _start,
          to: _end,
          diversion_sequence: indexOfDiversion
        })
      }
    } else {
      _waypoints.forEach((item, index) => {
        if (index === 0) {
          _routeArray.push({
            from: _start,
            to: item.formatted_address,
            diversion_sequence: indexOfDiversion
          })
          indexOfDiversion++
        } else {
          _routeArray.push({
            from: _waypoints[index - 1].formatted_address,
            to: item.formatted_address,
            diversion_sequence: indexOfDiversion
          })
          indexOfDiversion++
        }
      });
      _routeArray.push({
        from: _waypoints[_waypoints.length - 1].formatted_address,
        to: _end,
        diversion_sequence: indexOfDiversion
      })
    }
    return _routeArray;
  }

  sortArray(arr) {
    var sortedArray: string[] = arr.sort((n1, n2) => {
      if (Number(n1.diversion_sequence) > Number(n2.diversion_sequence)) {
        return 1;
      }
      if (n1 < n2) {
        return -1;
      }
      return 0;
    });
  }
  // Object Intialization Ends
  // Validate Object Starts
  validateLocationInArr(location) {
    if (this.startLoc === location) {
      return false
    } else if (this.endLoc === location) {
      return false
    } else if (this.waypoints.length > 0) {
      for (let counter = 0; counter < this.waypoints.length; counter++) {
        if (this.waypoints[counter].formatted_address === location) {
          return false;
        }
      }
    }
    return true;
  }
  validateReturnTrip() {
    if (this.quoteObj.return_trip === null || this.quoteObj.return_trip === '') {
      this.toastr.warning('Please provide trip type.', null)
      return false;
    }else if(this.bookingTime.date === null) {
      this.toastr.warning('Please provide date of Booking.', null)
      return false;
    } else if (this.validateDate(this.timeSettings.value, this.bookingTime.date, 'date')) {
      return false;
    }
    else if (this.quoteObj.return_trip === 'waiting_return_journey') {
      if (this.quoteObj.waiting_time === null) {
        this.toastr.warning('Please provide estimated waiting time.', null)
        return false
      }
    }
    if (this.quoteObj.return_trip === 'return_journey') {
      if(this.returnTime.date === null){
        this.toastr.warning('Please provide Return Date & Time of Booking.', null)
        return false
      }
      else if (this.validateDate(this.bookingService.generateTime(this.bookingTime.date, this.bookingTime.date.getHours(), this.bookingTime.date.getMinutes()), this.returnTime.date, 'Return Date')) {
        return false;
      }
    }
    return true;
  }
  validateDate(timeSetting, date, key) {
    if (date !== "") {
      let d1 = date;
      let hour = d1.getHours();
      let minutes = d1.getMinutes();
      let d2
      let errorMessage = '';
      if (key === 'date') {
        d2 = new Date();
        d2.setMilliseconds(d2.getMilliseconds() + timeSetting * 3600 * 1000);
        errorMessage = 'You can only book a ride after ' +
          d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate() + ' ' + d2.getHours() + ':' + d2.getMinutes()
      } else if (key === 'Return Date') {
        d2 = new Date(timeSetting * 1000);
        errorMessage = 'You can only set return Date and Time after ' +
          d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate() + ' ' + d2.getHours() + ':' + d2.getMinutes()
      }
      if (d1.getUTCFullYear() >= d2.getFullYear() &&
        d1.getUTCMonth() >= d2.getMonth() &&
        d1.getUTCDate() > d2.getDate()) {
        return false;
      } else if (d1.getUTCFullYear() >= d2.getFullYear() &&
        d1.getUTCMonth() > d2.getMonth()) {
        return false;
      } else if (d1.getUTCFullYear() === d2.getFullYear() &&
        d1.getUTCMonth() === d2.getMonth() &&
        d1.getUTCDate() === d2.getDate()) {
        const h = d2.getHours()
        const m = d2.getMinutes();
        if (
          hour > h) {
          return false;
        } else if (hour == h && minutes >= m) {
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
      this.toastr.warning('Please provide ' + key + ' of journey. Date must be valid.', null)
      return true;
    }
    return true
  }
  // Validate Objects Ends
  // Set Object Starts
  set(key, value) {
    this.tempAddress = value;
  }
  selectJourneyType(value) {
    this.quoteObj.return_trip = value;
  }
  selectInsertAfter(value) {
    this.insertAfter = value;
    this.positionSet = value
  }
  selectLoc(counter) {
    const tempObj: any = {};
    tempObj.formatted_address = this.location.locations[counter].google_map_friendly_name;
    this.tempAddress = tempObj;
  }
  selectCar(id) {
    this.selectedCarId = id;
    this.quoteObj.car_type_id = this.selectedCarId;
  }
  // Set Object Ends
  // navigate functionality starts
  update(key, value) {
    if (key === 'add') {
      if (this.insertAfter !== null && this.tempAddress !== null) {
        if (this.validateLocationInArr(this.tempAddress.formatted_address)) {
          const tempLocationObj = this.generateWaypoints(this.tempAddress, this.insertAfter, this.startLoc, this.endLoc, Object.assign([], this.waypoints))
          this.fetchDistane('add', tempLocationObj);
        } else {
          this.toastr.warning(
            'Location is already in the route.',
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
      } else {
        this.toastr.warning(
          'Form is invalid, all fields are required.',
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
    } else if (key === 'remove') {
      this.fetchDistane('', '');
    }
    this.positionSet = '';
  }
  remove(value) {
    if (this.startLoc.formatted_address === value) {
      if (this.waypoints.length > 0) {
        this.startLoc = this.waypoints[0]
        this.waypoints.splice(0, 1);
      }
    } else if (this.waypoints.length > 0) {
      for (let counter = 0; counter < this.waypoints.length; counter++) {
        if (this.waypoints[counter].formatted_address === value) {
          this.waypoints.splice(counter, 1);
        }
      }
    }
    this.update('remove', value)
  }
  next() {
    if (this.validateReturnTrip()) {
      this.quoteObj.bookingroutes = this.routeMapArray;
      this.quoteObj.routes = this.routeMapArray;
      if (this.quoteObj.return_trip === 'waiting_return_journey') {
        
        if ((Number(this.quoteObj.wait_hour) + Number(this.quoteObj.wait_minutes)) <= 0) {
          this.toastr.warning('Please provide estimated waiting time.', null)
          return false
        } else if (this.quoteObj.wait_hour.toString() === '' || this.quoteObj.wait_minutes.toString() === '') {
          this.toastr.warning('Please provide valid waiting time.', null);
          return false;
        } else {
          this.quoteObj.waiting_time = this.quoteObj.wait_hour * 60 + this.quoteObj.wait_minutes;
        }
      }
      if (this.quoteObj.car_type_id === null || this.quoteObj.car_type_id === "") {
        this.toastr.warning("Please select any car.", null);
        return;
      }
      if (this.quoteObj.return_trip !== 'single_journey') {
        this.quoteObj.returnTime = this.bookingService.generateTime(this.returnTime.date, this.returnTime.date.getHours(), this.returnTime.date.getMinutes())
      }
      this.updateQuote();
    }
  }
  // navigate fucntionality uends
  // Submit Object Starts
  updateQuote() {
    this.loading_next = true;
    this.quoteObj.routes = this.quoteObj.bookingroutes;
    this.bookingService.updateQuote(this.quoteObj)
      .subscribe(data => {
        this.loading_next = false;
        const res = data.json();
        this.bookingService.setLocalQuote(res[0])
        this.router.navigate(['passengers'])
      }, error => {
        this.loading_next = false;
      })
  }
  fetchDistane(key, locationObj) {
    this.loading = true;
    if (key === 'add') {
      this.quoteObj.routes = this.generateRoutes(locationObj.start, locationObj.end, locationObj.waypoints)
    } else {
      this.quoteObj.routes = this.generateRoutes(this.startLoc, this.endLoc, this.waypoints)
    }
    this.bookingService.updateQuote(this.quoteObj)
      .subscribe(data => {
        const res = data.json()[0];
        this.loading = false;
        this.insertAfter = null;
        this.location.description = ''
        const arr = this.sortArray(res.bookingroutes);
        this.initLocArray(res.bookingroutes);
        this.initWaypoints(res.bookingroutes);
        this.tempAddress = null
        this.routeMapArray = res.bookingroutes
      }, error => {
        this.loading = false;
      })
  }
  // Submit Object Ends
  // child component functionalty starts
  closePopup() {
    this.enablePopup = !this.enablePopup;
  }
  // child component ends

  // can deactivate starts
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.quoteObj.car_type_id === null || this.quoteObj.car_type_id === "") {
      let emitChangeSource = new Subject<boolean>();
      this.deactivateSubject = emitChangeSource;
      // this.enablePopup = true;
      // Observable string streams
      // return emitChangeSource.asObservable();
      let a = confirm("Are you sure you want to leave?")
      return a;
    }
    return true;
  }
  // can deactivate ends
}
interface time {
  date: Date;
}