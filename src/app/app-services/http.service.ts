import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/Rx';
import { Constants } from '../constants'

@Injectable()
export class HttpService {

  private accessTokken: string;
  private headers;
  private options;
  private api = Constants.API_URL;

  constructor(
    private http: Http,
    private toastr: ToastsManager
  ) {

  }

  setTokken(value) {
    this.accessTokken = value;
  }
  createHeader() {
    if (this.accessTokken) {
      this.headers = new Headers({ 'Content-Type': 'application/json' });
      this.headers.append('Authorization', 'Bearer ' + this.accessTokken);
      this.options = new RequestOptions({ headers: this.headers });
    } else {
      this.headers = new Headers({ 'Content-Type': 'application/json' });
      this.options = new RequestOptions({ headers: this.headers });
    }
    return this.options;
  }

  showError(error, showErrors) {
    switch (error.status) {
      case 401:
        if (showErrors.e401 !== false) {
          this.toastr.error('Not Authorized', 'Oops!', { showCloseButton: true });
        }
        break;
      case 400:
        if (showErrors.e400 !== false) {
          this.toastr.error('There seems to be some error.', 'Oops!', { showCloseButton: true });
        }
        break;
      case 500:
        if (showErrors.e500 !== false) {
          this.toastr.error('We are unable to process your request.', 'Oops!', { showCloseButton: true });
        }
        break;
      case 404:
        if (showErrors.e404 !== false) {
          this.toastr.error('Web page not found', 'Oops!', { showCloseButton: true });
        }
        break;
    }
  }

  post(method, value, showErrors = {}) {

    const url = this.api + method;
    const observable = this.http.post(url, value, this.createHeader()).share();


    observable.subscribe(
      data => { },
      error => { this.showError(error, showErrors); }
    )

    return observable;
  }

  get(method, value = '', showErrors = {}) {
    const url = this.api + method + value;
    const observable = this.http.get(url, this.createHeader()).share();


    observable.subscribe(
      data => { },
      error => { this.showError(error, showErrors); }
    )

    return observable;
  }
  delete(method, value = '', showErrors = {}) {
    const url = this.api + method + value;
    const observable = this.http.delete(url, this.createHeader()).share();


    observable.subscribe(
      data => { },
      error => { this.showError(error, showErrors); }
    )

    return observable;
  }
  put(method, value, showErrors = {}) {

    const url = this.api + method;
    const observable = this.http.put(url, value, this.createHeader()).share();


    observable.subscribe(
      data => { },
      error => { this.showError(error, showErrors); }
    )

    return observable;
  }
}
