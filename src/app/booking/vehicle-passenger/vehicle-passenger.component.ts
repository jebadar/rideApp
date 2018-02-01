import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '../../constants';
import { LoginComponent } from '../../users/login/login.component';
import { UserService } from '../../users/user.service'
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';
import { RouterEvent } from '@angular/router/src/events';
import { de } from 'ngx-bootstrap/bs-moment/i18n/de';
import { devModeEqual } from '@angular/core/src/change_detection/change_detection_util';
import { debug } from 'util';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-vehicle-passenger',
  templateUrl: './vehicle-passenger.component.html',
  styleUrls: ['../../layout/index/index.component.css']
})
export class VehiclePassengerComponent implements OnInit {
  @ViewChild('scrollToDiv') scrollDiv;

  assetsUrl = Constants.ASSET_URL;

  bookingForm: FormGroup;
  registerForm: FormGroup;
  someoneElseForm: FormGroup;

  enableLogin = false;
  registerRequire = false;
  someoneElseCheck = false;
  loadCars = false;
  loading = false;

  user: any = {};
  booking: any = {};
  RouteObjInherit: any = {};
  checkboxArr: any = {};
  someoneElse: any = {};
  Arr = Array;

  cars;
  selectedCarCounter = null;
  selectedCar;

  constructor(private userService: UserService,
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastsManager
  ) { }

  ngOnInit() {
    this.fetchCars();
    this.RouteObjInherit = this.bookingService.getLocalQuote().temp;
    this.closeLogin = this.closeLogin.bind(this);
    this.setUser = this.setUser.bind(this);
    this.skipCheck = this.skipCheck.bind(this);
    this.initForm();
    this.checkQuoteObj(this.RouteObjInherit);
    this.scrollDiv.nativeElement.scrollIntoView(true)
  }
  fetchCars() {
    this.loadCars = true
    this.bookingService.getCars()
      .subscribe(data => {
        this.loadCars = false;
        this.cars = data.json().cars;
        this.initValuesForEdit()
      }, error => {
        this.loadCars = false;
      })
  }
  checkQuoteObj(routeObj) {
    if (this.bookingService.isEmptyObject(routeObj)) {
      this.router.navigate([''])
    } else {
      this.user = this.userService.getLoggedInUser();
      if (this.bookingService.isEmptyObject(this.user)) {
        this.enableLogin = true;
      } else {
        this.registerForm.get('email').setValue(this.user.email);
        this.registerForm.get('name').setValue(this.user.name);
      }
      if (this.RouteObjInherit.terms === undefined) {
        this.RouteObjInherit.terms = false;
      }
    }
  }
  initValuesForEdit() {
    if (this.RouteObjInherit.customer_id != null) {
      const car_index = this.cars.findIndex(x => x.id === this.RouteObjInherit.car_id);
      this.cars[car_index].selected = true;
      this.selectedCarCounter = car_index;
      this.selectedCar = this.cars[car_index];
      const pickupDetail = JSON.parse(this.RouteObjInherit.pickup_details);
      this.bookingForm.get('car_id').setValue(this.RouteObjInherit.car_id);
      if (pickupDetail != null) {
        this.bookingForm.get('full_address_to').setValue(pickupDetail.to);
        this.bookingForm.get('full_address_from').setValue(pickupDetail.from);
      }
      this.onChange(this.RouteObjInherit.booking_for_self)
      if (this.RouteObjInherit.booking_for_self === 'someone') {
        this.someoneElseForm.get('email').setValue(this.RouteObjInherit.email);
        this.someoneElseForm.get('name').setValue(this.RouteObjInherit.passenger_name);
        this.someoneElseForm.get('phone').setValue(this.RouteObjInherit.contact_no);
      }
      this.bookingForm.get('dateDeparture').setValue(this.bookingService.convertDate(this.RouteObjInherit.date));
      this.bookingForm.get('timeDeparture').setValue(this.bookingService.convertTime('',this.RouteObjInherit.time));
      this.bookingForm.get('no_of_passengers').setValue(this.RouteObjInherit.no_of_passengers);
      this.bookingForm.get('no_of_suitCases').setValue(this.RouteObjInherit.no_of_suitcases)
      this.bookingForm.get('no_of_childs').setValue(this.RouteObjInherit.no_of_childseats)
      this.RouteObjInherit.routes = this.RouteObjInherit.bookingroutes;
    }
  }
  closeLogin() {
    this.enableLogin = !this.enableLogin;
  }
  setUser(userObj) {
    this.user = userObj;
  }
  skipCheck() {
    this.closeLogin();
    this.registerRequire = true;
  }
  loginUser() {
    this.userService.login(this.user.email, this.user.password)
    .subscribe(data => {
      const res = data;
      this.RouteObjInherit.customer_id = res.user_details[0].id;
      this.RouteObjInherit.confirm = 0;
      if (this.someoneElseCheck) {
        if (this.validateSomeoneElse()) {
          this.submitQuote();
        }
      } else {
        this.submitQuote();
      }
    }, error => {
      this.loading = false;
    })
  }
  next() {
    if (this.validateBooking()) {
      if (this.registerRequire) {
        if (this.validateUser()) {
          this.loading = true;
          this.userService.register(this.user)
            .subscribe(data => {
              const res = data.json();
              this.registerForm.get('email').setValue(this.user.email);
              this.registerForm.get('name').setValue(this.user.name);
              this.registerRequire = false;
              this.loginUser();
            }, error => {
              this.loading = false;
            })
        }
      } else {
        if (this.someoneElseCheck) {
          if (this.validateSomeoneElse()) {
            this.RouteObjInherit.confirm = 0;
            this.submitQuote();
          }
        } else {
          this.RouteObjInherit.confirm = 0
          this.user = this.userService.getLoggedInUser();
          this.RouteObjInherit.customer_id = this.user.id
          this.submitQuote();
        }
      }
    }
  }
  back() {
    this.router.navigate(['quote'])
  }
  submitQuote() {
    if (this.RouteObjInherit.terms === false || this.RouteObjInherit.terms === undefined ) {
      this.toastr.error('You are not agreed to terms and conditions of chauffeur', null);
      return
    }
    this.loading = true;
    this.bookingService.updateQuote(this.RouteObjInherit)
      .subscribe(data => {
        this.loading = false;
        const res = data.json()
        this.bookingService.setLocalQuote(res[0])
        this.toastr.success('Ride Booked Successfully')
        this.router.navigate(['summary'])
      }, error => {
        this.loading = false;
        this.toastr.error('Error in booking ride,Try Again', null);
      })
  }
  selectCar(counter) {
    if (this.selectedCarCounter === null) {
      this.selectedCarCounter = counter;
      this.cars[counter].selected = true;
    } else {
      this.cars[this.selectedCarCounter].selected = false;
      this.selectedCarCounter = counter;
      this.cars[counter].selected = true;
    }
    this.selectedCar = '';
    this.selectedCar = this.cars[counter];
    this.bookingForm.get('car_id').setValue(this.cars[counter].id);
  }
  onChange(value) {
    if (value === 'self') {
      this.checkboxArr.self = true;
      this.checkboxArr.someone = false;
      this.someoneElseCheck = false;
    } else if (value === 'someone') {
      this.checkboxArr.self = false;
      this.checkboxArr.someone = true
      this.someoneElseCheck = true;
    }
    if (value !== 'terms') {
      this.bookingForm.get('bookingFor').setValue(value);
    } else if (value === 'terms') {
      this.RouteObjInherit.terms = !this.RouteObjInherit.terms;
    }
  }
  matchPassword(password, confirmPassword) {
    if (password === confirmPassword) {
      return true;
    } else { return false; }
  }
  selectCarDetail(key, value) {
    if (key === 'no_of_passengers') {
      this.bookingForm.get('no_of_passengers').setValue(value);
      this.RouteObjInherit.no_of_passengers = value
    } else if (key === 'no_of_suitCases') {
      this.bookingForm.get('no_of_suitCases').setValue(value);
      this.RouteObjInherit.no_of_suitcases = value;
    } else if (key === 'no_of_childs') {
      this.bookingForm.get('no_of_childs').setValue(value);
      this.RouteObjInherit.no_of_childseats = value;
    }
  }
  validateUser() {
    if (this.registerForm.get('email').status === 'VALID') {
      this.user.email = this.registerForm.get('email').value;
    } else {
      this.toastr.warning('Email is required, Use valid email address', null);
      return false;
    }
    if (this.registerForm.get('password').status === 'VALID') {
      this.user.password = this.registerForm.get('password').value;
    } else {
      this.toastr.warning('Enter valid password, Min 5 charaters', null);
      return false;
    }
    if (this.registerForm.get('confirmPassword').status === 'VALID') {
      this.user.confirmPassword = this.registerForm.get('confirmPassword').value;
    } else {
      this.toastr.warning('Enter valid  confirm password, Min 5 charaters', null);
      return false;
    }
    if (this.registerForm.get('name').status === 'VALID') {
      this.user.name = this.registerForm.get('name').value;
    } else {
      this.toastr.warning('Name is required, Please enter', null);
      return false;
    }
    if (this.registerForm.status === 'VALID') {
      if (this.matchPassword(this.user.password, this.user.confirmPassword)) {
        delete this.user.confirmPassword;
        return true;
      } else {
        this.toastr.warning('Passwords do not match', null);
        return false;
      }
    }
  }
  validateBooking() {
    if (this.bookingForm.get('car_id').status === 'VALID') {
      this.RouteObjInherit.car_id = this.bookingForm.get('car_id').value;
    } else {
      this.toastr.warning('Please select one car!', null);
      return false;
    }
    if (this.bookingForm.get('dateDeparture').status === 'VALID') {
      this.RouteObjInherit.date = this.bookingForm.get('dateDeparture').value;
    } else {
      this.toastr.warning('Date of depature is required!', null);
      return false;
    }
    if (this.bookingForm.get('timeDeparture').status === 'VALID') {
      this.RouteObjInherit.time = this.bookingForm.get('timeDeparture').value;
    } else {
      this.toastr.warning('Time of depature is required!', null);
      return false;
    }
    if (this.bookingForm.get('bookingFor').status === 'VALID') {
      this.RouteObjInherit.booking_for_self = this.bookingForm.get('bookingFor').value;
    } else {
      this.toastr.warning('For whom you are booking ride, Please select!', null);
      return false;
    }
    if (this.bookingForm.get('no_of_passengers').status === 'VALID') {
      this.RouteObjInherit.no_of_passengers = this.bookingForm.get('no_of_passengers').value;
    } else {
      this.toastr.warning('How many passengers are taking ride, Please specify!', null);
      return false;
    }
    if (this.bookingForm.get('no_of_childs').status === 'VALID') {
    } else {
      this.toastr.warning('How many childrens are taking ride, Please select!', null);
      return false;
    }
    if (this.bookingForm.get('no_of_suitCases').status === 'VALID') {
    } else {
      this.toastr.warning('How many suit cases are in Luggage, Please select!', null);
      return false;
    }
    if (this.bookingForm.get('full_address_from').status === 'VALID') {
      this.RouteObjInherit.pickup_details = this.bookingForm.get('full_address_from').value;
    } else {
      this.toastr.warning('Pickup location is required, Please Enter!', null);
      return false;
    }
    if (this.bookingForm.get('full_address_to').status === 'VALID') {
      this.RouteObjInherit.pickup_details = JSON.stringify({
        from: this.RouteObjInherit.pickup_details,
        to: this.bookingForm.get('full_address_to').value
      })
    } else {
      this.toastr.warning('Drop off location is required, Please Enter!', null);
      return false;
    }
    if (this.bookingForm.status === 'VALID') {
      return true
    }
  }
  validateSomeoneElse() {
    if (this.someoneElseForm.get('email').status === 'VALID') {
      this.RouteObjInherit.email = this.someoneElseForm.get('email').value;
    } else {
      this.toastr.warning('Email is required of riding person, Use valid email address', null);
      return false;
    }
    if (this.someoneElseForm.get('name').status === 'VALID') {
      this.RouteObjInherit.passenger_name = this.someoneElseForm.get('name').value;
    } else {
      this.toastr.warning('Name is required of riding person, Please enter', null);
      return false;
    }
    if (this.someoneElseForm.get('phone').status === 'VALID') {
      this.RouteObjInherit.contact_no = this.someoneElseForm.get('phone').value;
    } else {
      this.toastr.warning('Phone number is required of riding person, Please enter', null);
      return false;
    }
    if (this.someoneElseForm.status === 'VALID') {
      return true;
    }
  }
  initForm() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9!#$%&\'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$')
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern('^.{5,}$')
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern('^.{5,}$')
      ]),
      name: new FormControl(null, [
        Validators.required
      ]),
    });
    this.bookingForm = new FormGroup({
      dateDeparture: new FormControl(null, [
        Validators.required
      ]),
      timeDeparture: new FormControl(null, [
        Validators.required
      ]),
      bookingFor: new FormControl(null, [
        Validators.required
      ]),
      no_of_passengers: new FormControl(null, [
        Validators.required
      ]),
      no_of_childs: new FormControl(null, [
        Validators.required
      ]),
      no_of_suitCases: new FormControl(null, [
        Validators.required
      ]),
      full_address_from: new FormControl(null, [
        Validators.required
      ]),
      full_address_to: new FormControl(null, [
        Validators.required
      ]),
      car_id: new FormControl(null, [
        Validators.required
      ])
    });
    this.someoneElseForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9!#$%&\'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$')
      ]),
      name: new FormControl(null, [
        Validators.required
      ]),
      phone: new FormControl(null, [
        Validators.required
      ]),
    });
  }
}
