import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Constants } from '../../constants';
import { PickupMainComponent } from '../../booking/pickup-main/pickup-main.component';
import { UserService } from '../../users/user.service'
import { BookingService } from '../../booking/booking.service'
import { BookingModule } from 'app/booking/booking.module';
import { enableDebugTools } from '@angular/platform-browser/src/browser/tools/tools';
import { Router } from '@angular/router';
import { CollapseDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-index',
  /* tslint:disable-next-line */
  host: {
    '(document:click)': 'handleClick($event)',
  },
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild('navResponsive') elementRef: ElementRef;

  assetsUrl = Constants.ASSET_URL;

  user: any = {};

  enableProfileBtn = false;

  public isCollapsed = true;

  constructor(private userService: UserService,
  private bookingService: BookingService,
  private router: Router) { }

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    if (this.bookingService.isEmptyObject(this.user)) {
      this.enableProfileBtn = false;
    } else  {
      this.enableProfileBtn = true;
    }
  }
  navigate(key) {
    this.collapseMenu()
    this.router.navigate([key])
  }
  collapseMenu() {
    this.isCollapsed = !this.isCollapsed;
  }
  handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
        if (clickedComponent === this.elementRef.nativeElement) {
            inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (inside) {
      // if clicked inside navbar
    } else {
      // if clicked outside nabar area
      // disable all toggle of navbar
      if (!this.isCollapsed) {
        this.isCollapsed = true;
      }
    }
  }
}
