import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from '../app-services/http.service';
import { LocalStoreService } from '../app-services/local-store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constants } from '../constants';

@Injectable()
export class UserService {
  returnUrl: string;
  loading = false;
  private accessTokken;
  private user: any = {};
  private reserveQuote: any = {};

  constructor(
    private httpServicesService: HttpService,
    private locStoreService: LocalStoreService,
    private toastr: ToastsManager
  ) {
    if (locStoreService.get('user_tokken')) {
      this.accessTokken = locStoreService.get('user_tokken');
      this.user = JSON.parse(locStoreService.get('user_detail'));
      this.httpServicesService.setTokken(this.accessTokken);
    }
  }
  isAuthenticated() {
    if (this.accessTokken != null) {
      return true;
    } else {
      return false;
    }
  }
  login(email: string, password: string) {
    const showErrors = {
      e401: false
    }
    const observable = this.httpServicesService.post('login', JSON.stringify({ email: email, password: password }), showErrors)
      .map((response: Response) => {
        const user = response.json();
        return user;
      });

    observable.subscribe(user => {
      if (user && user.access_token) {
        this.locStoreService.set('user_tokken', user.access_token);
        this.httpServicesService.setTokken(user.access_token);
        this.locStoreService.set('user_detail', JSON.stringify(user.user_details[0]));
        this.user = user.user_details[0];
        this.accessTokken = user.access_token;
        this.toastr.success('Login Successfull.', null);
      }
    }, error => {
      if (error.status === 401) {
        this.toastr.error('Invalid email / password.', 'Oops!', { showCloseButton: true });
      }
    });
    return observable
  }
  logout() {
    // remove user from local storage
    this.locStoreService.remove('user_tokken');
    this.user = {};
    this.httpServicesService.setTokken('');
  }
  getLocationType() {
    const observable = this.httpServicesService.get('locationtype')
    return observable;
  }
  setQuote(obj) {
    this.reserveQuote = obj;
  }
  getQuote() {
    return this.reserveQuote;
  }
  getLoggedInUser() {
    return this.user;
  }
  getLoggedInUserId() {
    return this.user.id;
  }
  register(user) {
    const showErrors = {
      e422: false
    }
    const observable = this.httpServicesService.post('users/register', JSON.stringify({ user }), showErrors)
    observable.subscribe(data => {
    }, error => {
      if (error.status === 422) {
       const err = error.json();
        this.toastr.error(err.message, 'Oops!', { showCloseButton: true });
      }
    });
    return observable;
  }
  verify(verifyTokken) {
    const observable = this.httpServicesService.get('users/verification/' + verifyTokken)
    return observable
  }
  resetPassword(user) {
    const observable = this.httpServicesService.post('users/reset', JSON.stringify({ user }))
    return observable;
  }
  forgetPassword(email) {
    const observable = this.httpServicesService.get('users/forget/', email)
    return observable;
  }
  editUser(user) {
    const observable = this.httpServicesService.put('users/' + user.id, JSON.stringify({user}))
    .map((response: Response) => {
      const _user = response.json();
      return _user;
    });
    observable.subscribe(_user => {
      if (_user) {
        this.locStoreService.set('user_detail', JSON.stringify(_user[0]));
        this.user = _user[0];
      }
    });
    return observable;
  }
}
