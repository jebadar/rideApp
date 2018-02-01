import { Injectable } from '@angular/core';

@Injectable()
export class LocalStoreService {

  constructor() { }

  // key -> 'userTokken' for access tokken & 'userDetail' for user detail
  get(key) {
    return localStorage.getItem(key);
  }

  set(key, value) {
    localStorage.setItem(key, value);
  }

  remove(key) {
    localStorage.removeItem(key);
  }
}
