import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BookingService } from '../../booking/booking.service'
import { LoaderComponent } from '../../shared/loader/loader.component';
import { EditComponent } from '../edit/edit.component';
import { BannerService } from '../../shared/banner-service/banner.service'
import { ConfirmPopupComponent } from '../../shared/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  assetsUrl = Constants.ASSET_URL;

  user: any = {};
  bookingList: Array<any> = [];

  limit = 3;
  page = 0;
  cancelBookingId;

  loading = false;
  load_more = false;
  exit = false;
  enableEdit = false;
  enableConfirm = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastsManager,
    private bookingService: BookingService,
    private bannerService: BannerService
  ) { }

  ngOnInit() {
    setTimeout(() => { this.bannerService.setTitle("profile"); }, 0);
    this.updateUser();
    this.fetchQuotes();
    this.cancelBooking = this.cancelBooking.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
  }
  fetchQuotes() {
    this.loading = true;
    this.bookingService.getUserQuotes(this.limit, this.page, this.user.id)
      .subscribe(data => {
        const List = data.json().booking;
        this.loading = false;
        if (List.length > 0) {
          for (const k of Object.keys(List)) {
            this.bookingList.push(List[k]);
          }
        } else {
          this.load_more = true;
        }
      }, error => {
        this.loading = false;
      })
  }
  cancelPopup(id) {
    this.cancelBookingId = id;
    this.enableConfirm = true;
  }
  cancelBooking() {
    let booking: any = this.bookingList.filter(x => x.id == this.cancelBookingId);
    booking = booking[0];
    booking.confirm = 4;
    booking.routes = booking.bookingroutes;
    this.bookingService.updateQuote(booking)
      .subscribe(data => {
        this.enableConfirm = false;
        const res = data.json();
        const index = this.bookingList.findIndex(x => x.id == res[0].id);
        this.bookingList[index] = res[0]
      }, error => {
        this.loading = false;
        this.toastr.error('Error in cancel booking ride,Try Again', null);
      })
  }
  closeConfirm() {
    this.enableConfirm = !this.enableConfirm;
  }
  signout() {
    this.bookingList = [];
    this.exit = true;
    this.userService.logout();
    this.router.navigate(['/']);
  }
  editBooking(index) {
    const booking = this.bookingList[index];
    this.bookingService.setLocalQuote(booking);
    this.router.navigate(['quote'])
  }
  edit() {
    this.enableEdit = !this.enableEdit;
  }
  updateUser() {
    this.user = this.userService.getLoggedInUser();
  }
  closeEdit() {
    this.updateUser()
    this.enableEdit = false;
  }
  onScroll() {
    if (!this.load_more) {
      this.page++
      this.fetchQuotes();
    }
  }
  checkTimeofBooking(time) {
    let d1 = new Date();
    let d2 = new Date(time * 1000);
    if (d1.getFullYear() >= d2.getFullYear() &&
      d1.getMonth() >= d2.getMonth() &&
      d1.getDate() > d2.getDate()) {
      return 'badge-danger';
    } else if(d2.getUTCFullYear() >= d1.getFullYear() &&
      d2.getUTCMonth() > d1.getMonth()){
        return 'badge-light';
    } else if(
      d1.getFullYear() <= d2.getFullYear() &&
      d1.getMonth() <= d2.getMonth() &&
      d1.getDate() <= d2.getDate()
    ) {
      return 'badge-light';
    }
    else {
      return 'badge-danger';
    }
  }
}
