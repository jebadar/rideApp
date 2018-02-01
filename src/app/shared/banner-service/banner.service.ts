import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BannerService {

  constructor() { }
  // Observable string sources
private emitChangeSource = new Subject<any>();
// Observable string streams
changeEmitted$ = this.emitChangeSource.asObservable();
// Service message commands
setTitle(change: any) {
    this.emitChangeSource.next(change);
}

}

