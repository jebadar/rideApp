import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Constants } from '../../constants';
import { BookingService } from '../booking.service';
import { DirecDirective } from '../../shared/direc-directive';
import { GoogleMapComponent } from '../../shared/google-map/google-map.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../../layout/index/index.component.css']
})
export class QuoteComponent implements OnInit {
  @ViewChild('scrollToDiv') scrollDiv;

  assetsUrl = Constants.ASSET_URL;

  loading = false;
  load_types = false;
  enableResponsive = false;

  waypoints: any = [];
  locArray = [];
  routeMapArray = [];
  changeFunc: any = {
    update: null
  };
  quoteObj: any = {};
  location: any = {};

  startLoc;
  endLoc;
  positionSet = '';
  tempAddress: any = null;
  typesObj;
  insertAfter = null;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastsManager
  ) { }

  ngOnInit() {
    this.quoteObj = this.bookingService.getLocalQuote().temp
    this.enableResponsive = this.bookingService.detectResponsive();
    this.fetchLocationType();
    this.location.description = '';
    this.set = this.set.bind(this);
    this.scrollDiv.nativeElement.scrollIntoView(true);
    this.checkObject(this.quoteObj)
  }
  checkObject(routeObj) {
    if (this.bookingService.isEmptyObject(routeObj)) {
      this.router.navigate([''])
    } else {
      this.routeMapArray = this.quoteObj.bookingroutes
      this.initLocArray(this.quoteObj.bookingroutes);
      this.initWaypoints(this.quoteObj.bookingroutes)
    }
  }
  initLocArray(_routes) {
    this.locArray = [];
    _routes.forEach((item,index) => {
      if(index === _routes.length-1) {
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
  set(key, value) {
    this.tempAddress = value;
  }
  update(key, value) {
    if (key === 'add') {
      if (this.insertAfter !== null && this.tempAddress !== null) {
        if (this.validateLocationInArr(this.tempAddress.formatted_address)) {
          const tempLocationObj = this.generateWaypoints(this.tempAddress,this.insertAfter,this.startLoc, this.endLoc, Object.assign([],this.waypoints))          
          this.fetchDistane('add',tempLocationObj);
        } else {
          this.toastr.warning(
            'Location is already in the route.',
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
      } else {
        this.toastr.warning(
          'Form is invalid, all fields are required.',
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
    } else if (key === 'remove') {
      this.fetchDistane('','');
    }
    this.positionSet = '';
  }
  selectInsertAfter(value) {
    this.insertAfter = value;
    this.positionSet = value
  }
  generateWaypoints(_new,_after,_start,_end,_waypoints) {
    let objectLocation:any = {};
    objectLocation.start = _start;
    objectLocation.end = _end;
    objectLocation.waypoints = _waypoints;
      if(_start === _after) {
        objectLocation.waypoints.push(_new);
      } else if(_end === _after) {
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
  initWaypoints(_routes) {
    this.startLoc = _routes[0].from;
    this.endLoc = _routes[_routes.length-1].to;
    this.waypoints = [];
    if(_routes.length > 1) {
      _routes.forEach((item,index) => {
          if(index <= _routes.length -1 && index > 0) {
            let temp:any = {};
            temp.formatted_address = item.from;
            this.waypoints.push(temp);
          }
      });
    }
    if(this.changeFunc.update != undefined) {
      this.changeFunc.update(this.startLoc, this.endLoc, this.waypoints);
    }
  }
  fetchDistane(key, locationObj) {
    this.loading = true;
    if(key === 'add') {
      this.quoteObj.routes = this.generateRoutes(locationObj.start, locationObj.end,locationObj.waypoints)
    } else {
      this.quoteObj.routes = this.generateRoutes(this.startLoc, this.endLoc, this.waypoints)
    }
    this.bookingService.updateQuote(this.quoteObj)
    .subscribe(data => {
      const res = data.json()[0];
      this.loading = false;
      this.insertAfter = null;
      this.location.description = ''
      this.initLocArray(res.bookingroutes);
      this.initWaypoints(res.bookingroutes);
      this.tempAddress = null
      this.routeMapArray = res.bookingroutes
    }, error => {
      this.loading = false;
    })
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
      this.bookingService.setLocalQuote(this.quoteObj);
      this.router.navigate(['passengers'])
    }
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
  selectLoc(counter) {
    const tempObj: any = {};
    tempObj.formatted_address = this.location.locations[counter].google_map_friendly_name;
    this.tempAddress = tempObj;
  }
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
    if (this.quoteObj.return_trip === null) {
      this.toastr.warning('Please provide trip type.', null)
      return false;
    } else if (this.quoteObj.return_trip === 'waiting_return_journey') {
      if (this.quoteObj.waiting_time === null) {
        this.toastr.warning('Please provide estimated waiting time.', null)
        return false
      }
      return true;
    }
    return true;
  }
}
