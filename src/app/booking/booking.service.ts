import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from '../app-services/http.service';
import { LocalStoreService } from '../app-services/local-store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constants } from '../constants';
import { debug } from 'util';
import qs from 'qs';
import { Router } from '@angular/router';

@Injectable()
export class BookingService {

  returnUrl: string;
  loading = false;
  settings: any = {};
  private quoteDetail: any = {};

   constructor(
    private httpServicesService: HttpService,
    private locStoreService: LocalStoreService,
    private toastr: ToastsManager,
    private router: Router
  ) { }

  getLocationType() {
      const observable = this.httpServicesService.get('locationtype')
      return observable
  }
  updateQuote(booking) {
    const showErrors = {
      e422: false
    }
    const _temp = JSON.parse(this.locStoreService.get('quote')).temp;
    booking.time = _temp.time;
    const observable = this.httpServicesService.put('booking/' + booking.id, JSON.stringify({booking}), showErrors)
    observable.subscribe(
      data => {

      },
      error => {
        if (error.status === 422) {
          let er = error.json();
          console.log(er.message);
          if(er.code === 422) {
            this.toastr.error('Booking cannot be updated',
            'Oops!', { showCloseButton: true });
          } else {
            this.toastr.error('We are facing some technical difficulties. Please contact web administrator',
          'Oops!', { showCloseButton: true });
          }
        }
      }
    )
    return observable;
  }
  getLocalSettings() {
    this.locStoreService.get("settings");
  }
  getSetting() {
    return new Observable(observer => {
      if(this.locStoreService.get("settings")){
        let settings = this.locStoreService.get("settings");
        this.settings = JSON.parse(settings);
        setTimeout(()=>{observer.next(this.settings)},0);
      }

      this.httpServicesService.get('setting')
      .subscribe(data => {
        this.settings = data.json()
        this.locStoreService.set("settings",JSON.stringify(this.settings));
        observer.next(this.settings);
        observer.complete();
      }, err=>{
        observer.error(err);
      });
    });
  }
  getCars() {
    const observable = this.httpServicesService.get('cartype')
    return observable
  }
  isEmptyObject(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }
  createQuote(booking) {
    const showErrors = {
      e422: false
    }
    const observable = this.httpServicesService.post('booking', JSON.stringify({booking}), showErrors)
    observable.subscribe(data => {
      this.quoteDetail = data.json();
      const temp = this.quoteDetail[0];
      this.locStoreService.set('quote', JSON.stringify({temp}))
    }, error =>{
      if (error.status === 422) {
        this.toastr.error('We are facing some technical difficulties. Please contact web administrator',
        'Oops!', { showCloseButton: true });
      }
    });
    return observable;
  }
  getLocalQuote() {
    const temp = JSON.parse(this.locStoreService.get('quote'));
    if (temp === undefined) {
      this.router.navigate(['']);
    } else {
      return temp;
    }
  }
  setLocalQuote(temp) {
    this.locStoreService.set('quote', JSON.stringify({temp}))
  }
  getUserQuotes(limit, page, customer_id) {
    const queryString = this.generateStr(limit, page, customer_id);
    const observable = this.httpServicesService.get('booking?' + queryString);
    return observable;
  }
  generateStr(limit, page, customer_id) {
    const filters = []
    const filtersObj = {
      limit,
      page,
      filter_groups: []
    }
    if (customer_id != null) {
      filters.push({ key: 'customer_id', value: customer_id, operator: 'eq' });
    }
    if (filters.length > 0) {
      filtersObj.filter_groups = [{
                                    and: true,
                                    filters
                                  }]
    }
    return qs.stringify(filtersObj)
  }
  generateTime(date,hour,minutes) {
    let time;
    let AmPm;
    if(hour < 10)
    {
      hour = '0' + hour 
    } 
    if(minutes < 10)
    {
      minutes = '0'+minutes;
    }
    time = date.getFullYear()+'-'+('0' + (date.getMonth() + 1)).slice(-2)+'-'+('0' + date.getDate()).slice(-2)+ ' ' + hour + ':' + minutes + ':00';
    let de = new Date(time).getTime();
    de = de/1000;
    return de;
  }
  /* tslint:disable */
  convertTime(key,timestamp) {
    let d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
      ampm = 'AM',
      time;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh === 0) {
      h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    if (h > 9) {
      time = h + ':' + min
    } else {
    time = '0' + h + ':' + min;
    }
    if(key === 'summary') {
      return time + ' ' + ampm;
    } else {
      return time
    }
  }
  /* tslint:enable */
  /* tslint:disable */
  convertDate(date) {
    let d = new Date(date * 1000),	// Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
    ampm = 'AM',
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = 'PM';
  } else if (hh === 12) {
    h = 12;
    ampm = 'PM';
  } else if (hh === 0) {
    h = 12;
  }

  // ie: 2013-02-18, 8:35 AM
  time = yyyy + '-' + mm + '-' + dd;

  return time;
  }
  /* tslint:enable */
  detectResponsive() {
    if (window.innerWidth <= 800 && window.innerHeight <= 800) {
      return true;
    } else {
      return false;
    }
  }
}



