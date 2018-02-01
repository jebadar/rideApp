import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Constants } from '../../constants';
import { UserService } from '../../users/user.service'
import { BookingService } from '../../booking/booking.service'
import { Router } from '@angular/router';
import { CollapseDirective } from 'ngx-bootstrap';
import { BannerService } from '../../shared/banner-service/banner.service'
import { LoginComponent } from '../../users/login/login.component';

@Component({
  selector: 'app-index-new',  
  /* tslint:disable-next-line */
  host: {
    '(document:click)': 'handleClick($event)',
  },
  templateUrl: './index-new.component.html',
  styleUrls: ['./index-new.component.css']
})
export class IndexNewComponent implements OnInit, AfterViewChecked {
  @ViewChild('navResponsive') elementRef: ElementRef;

  assetsUrl = Constants.ASSET_URL;
  
  user: any = {};

  enableProfileBtn = false;
  enableLoginBtn = false;
  enableLoginPopup = false;

  public isCollapsed = true;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private router: Router,
    private bannerService:BannerService
  ) { }

  ngOnInit() {
    this.bannerService.setTitle('passengers');
    this.bookingService.getSetting();
    this.closeLogin = this.closeLogin.bind(this);
    this.setUser = this.setUser.bind(this);
    this.skipCheck = this.skipCheck.bind(this);
    this.checkUser();
  }
  checkUser() {
    this.user = this.userService.getLoggedInUser();
    if (this.bookingService.isEmptyObject(this.user)) {
      this.enableLoginBtn = true;
      this.enableProfileBtn = false;
    } else  {
      this.enableProfileBtn = true;
      this.enableLoginBtn = false;
    }
  }
  ngAfterViewChecked() {
    this.checkUser();
  }
  closeLogin() {
    this.enableLoginPopup = !this.enableLoginPopup;
  }
  setUser(userObj) {
    this.user = userObj.user_details[0];
    this.enableLoginBtn = false;
    this.enableProfileBtn = true;
  }
  navigate(key) {
    this.collapseMenu()
    if(key !== 'login') {
      this.router.navigate([key])
    } else if(key === 'login') {
      this.enableLoginPopup = true;
    }
  }
  skipCheck() {
    this.closeLogin()
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
