import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '../../constants';
import { BsDropdownModule } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { RouterEvent } from '@angular/router/src/events';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CanDeactivateGuard } from '../../app-routing/can-deactivate.guard'
import { Observable } from 'rxjs/Observable';
// component
import { LoaderComponent } from '../../shared/loader/loader.component';
import { LoginComponent } from '../../users/login/login.component';
// services
import { BannerService } from '../../shared/banner-service/banner.service'
import { UserService } from '../../users/user.service'
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-cars-passenger-component',
  templateUrl: './cars-passenger.component.html',
  styleUrls: ['./cars-passenger.component.css']
})
export class CarsPassengerComponent implements OnInit, CanDeactivateGuard {

  @ViewChild('scrollToDiv') scrollDiv;
  @ViewChild('field') fieldDiv;

  assetsUrl = Constants.ASSET_URL;
  // Form Groups
  bookingForm: FormGroup;
  registerForm: FormGroup;
  someoneElseForm: FormGroup;
  // Flags
  enableLogin = false;
  registerRequire = false;
  someoneElseCheck = false;
  loadCars = false;
  loading = false;
  enableChildDetail = false;
  changesNotSaved = true;
  // Objects
  user: any = {};
  booking: any = {};
  RouteObjInherit: any = {};
  checkboxArr: any = {};
  someoneElse: any = {};
  Arr = Array;
  childSeatArr: Array<keyValue> = [];

  constructor(private userService: UserService,
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastsManager,
    private bannerService: BannerService
  ) { }

  ngOnInit() {
    setTimeout(() => { this.bannerService.setTitle("passengers"); }, 0);
    this.RouteObjInherit = this.bookingService.getLocalQuote().temp;
    this.checkStage()
    this.initChildSeats(this.RouteObjInherit.childseats);
    this.closeLogin = this.closeLogin.bind(this);
    this.setUser = this.setUser.bind(this);
    this.skipCheck = this.skipCheck.bind(this);
    this.initForm();
    this.checkQuoteObj(this.RouteObjInherit);
    this.scrollDiv.nativeElement.scrollIntoView(true)
    this.initValuesForEdit();
    this.bookingForm.get('bookingFor').setValue('self');
    this.checkboxArr.self = true;
  }
  // Initialization Object starts
  checkStage() {
    if(this.RouteObjInherit.car_type_id === null) {
      this.router.navigate(['quote'])
    }
  }
  initChildSeats(seats) {
    if (seats.length > 0) {
      this.enableChildDetail = true;
      this.childSeatArr = [];
      for (let i of seats) {
        let name = this.RouteObjInherit.cartype.seats.filter(x => x.seat == i.seat_id)
        this.childSeatArr.push({
          name: name[0].childseat.name,
          id: name[0].seat
        })
      }
    } else {
      this.RouteObjInherit.no_of_childseats = 0;
    }
    this.RouteObjInherit.childseats = [];
  }
  checkQuoteObj(routeObj) {
    if (this.bookingService.isEmptyObject(routeObj)) {
      this.router.navigate([''])
    } else {
      if(this.RouteObjInherit.car_type_id === null) {
        this.router.navigate(['quote'])
      }
      this.user = this.userService.getLoggedInUser();
      if (this.bookingService.isEmptyObject(this.user)) {
        this.enableLogin = true;
      } else {
        this.checkLocalUser()
      }
      if (this.RouteObjInherit.terms === undefined) {
        this.RouteObjInherit.terms = false;
      }
    }
  }
  checkLocalUser() {
    this.bookingService.getUserQuotes(3, 0, this.user.id)
    .subscribe(data => {
      this.initUser();
    }, error => {
      if(error.status === 401)
      this.enableLogin = true;
    })
  }
  initUser() {
    this.registerForm.get('email').setValue(this.user.email);
    this.registerForm.get('name').setValue(this.user.name);
    this.registerForm.get('phone').setValue(this.user.contact_no);
    this.registerRequire = false;
  }
  initValuesForEdit() {
    // const pickupDetail = JSON.parse(this.RouteObjInherit.pickup_details);
    // if (pickupDetail != null) {
    //   this.bookingForm.get('full_address_to').setValue(pickupDetail.to);
    //   this.bookingForm.get('full_address_from').setValue(pickupDetail.from);
    // }
    this.onChange(this.RouteObjInherit.booking_for_self)
    if (this.RouteObjInherit.booking_for_self === 'someone') {
      this.someoneElseForm.get('email').setValue(this.RouteObjInherit.email);
      this.someoneElseForm.get('name').setValue(this.RouteObjInherit.passenger_name);
      this.someoneElseForm.get('phone').setValue(this.RouteObjInherit.contact_no);
    }
    this.bookingForm.get('no_of_passengers').setValue(this.RouteObjInherit.no_of_passengers);
    this.bookingForm.get('no_of_suitCases').setValue(this.RouteObjInherit.no_of_suitcases)
    this.bookingForm.get('no_of_childs').setValue(this.RouteObjInherit.no_of_childseats)
    this.RouteObjInherit.routes = this.RouteObjInherit.bookingroutes;
  }
  // Initialization ends

  // submit Objects starts
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
    if (this.RouteObjInherit.terms === false || this.RouteObjInherit.terms === undefined) {
      this.toastr.error('You are not agreed to terms and conditions of chauffeur', null);
      return
    }
    if (this.validateBooking() && this.validateChildSeats() && this.validateFields()) {
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
              let err = error.json();
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
    } else {
      this.fieldDiv.nativeElement.scrollIntoView(true)
    }
  }
  submitQuote() {
    this.loading = true;
    this.RouteObjInherit.routes = this.RouteObjInherit.bookingroutes;
    delete this.RouteObjInherit.customer_id;
    this.bookingService.updateQuote(this.RouteObjInherit)
      .subscribe(data => {
        this.loading = false;
        const res = data.json()
        this.bookingService.setLocalQuote(res[0])
        this.changesNotSaved = false;
        this.toastr.success('Ride Booked Successfully')
        this.router.navigate(['summary'])
      }, error => {
        this.loading = false;
        this.toastr.error('Error in booking ride,Try Again', null);
      })
  }
  // submit objects ends
  // object Functionality starts
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
  back() {
    this.router.navigate(['quote'])
  }
  match(val1, val2) {
    if (val1 === val2) {
      return true;
    } else { return false; }
  }
  closeLogin() {
    this.enableLogin = !this.enableLogin;
  }
  skipCheck() {
    this.closeLogin();
    this.registerRequire = true;
  }
  // object functionality ends
  // Set objects
  setUser(userObj) {
    this.user = userObj.user_details[0];
    this.initUser();
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
      this.childSeatArr = [];
      if(value > 0) {
      for (let i = 0; i < this.RouteObjInherit.no_of_childseats; i++) {
        this.childSeatArr.push({
          name: "Select Child Detail",
          id: 0
        })
      }
      this.enableChildDetail = true;
      } else {
      this.enableChildDetail = false;        
      }

    }
  }
  selectChild(id, name, number) {
    this.childSeatArr[number].name = name;
    this.childSeatArr[number].id = id;
  }
  // set objects ends
  // can deactivate starts
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.changesNotSaved) {
      return confirm("Are you sure you want to leave?")
    }
    return true;
  }
  // can deactivate ends

  // Validation object Starts
  validateChildSeats() {
    for (let i = 0; i < this.RouteObjInherit.no_of_childseats; i++) {
      if (this.childSeatArr[i].name === "Select Child Detail" || this.childSeatArr[i].id === 0) {
        this.toastr.warning('All Child seats types are not selected, Please select!', null);
        this.RouteObjInherit.childseats = [];
        return false;
      } else {
        this.RouteObjInherit.childseats.push(this.childSeatArr[i].id);
      }
    }
    return true;
  }
  validateUser() {
    if (this.registerForm.get('email').status === 'VALID') {
      this.user.email = this.registerForm.get('email').value;
    } else {
      this.toastr.warning('Email is required, Use valid email address', null);
      return false;
    }
    if (this.registerForm.get('confirmEmail').status === 'VALID') {
      this.user.confirmEmail = this.registerForm.get('confirmEmail').value;
    } else {
      this.toastr.warning('Confirm email is required, Please enter.', null);
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
    if (this.registerForm.get('phone').status === 'VALID') {
      this.user.contact_no = this.registerForm.get('phone').value;
    } else {
      this.toastr.warning('Phone number is required, Please enter.', null);
      return false;
    }
    if (this.registerForm.status === 'VALID') {
      if (this.match(this.user.password, this.user.confirmPassword)) {
        delete this.user.confirmPassword;
      } else {
        this.toastr.warning('Passwords do not match', null);
        return false;
      }
      if (this.match(this.user.email, this.user.confirmEmail)) {
        delete this.user.confirmEmail;
      } else {
        this.toastr.warning('Emails do not match', null);
        return false;
      }
      return true;
    }
  }
  validateBooking() {
    // if (this.bookingForm.get('full_address_from').status === 'VALID') {
    //   this.RouteObjInherit.pickup_details = this.bookingForm.get('full_address_from').value;
    // } else {
    //   this.bookingForm.controls.full_address_from.markAsTouched()      
    //   this.toastr.warning('Pickup location is required, Please Enter!', null);
    //   return false;
    // }
    // if (this.bookingForm.get('full_address_to').status === 'VALID') {
    //   this.RouteObjInherit.pickup_details = JSON.stringify({
    //     from: this.RouteObjInherit.pickup_details,
    //     to: this.bookingForm.get('full_address_to').value
    //   })
    // } else {
    //   this.bookingForm.controls.full_address_to.markAsTouched()      
    //   this.toastr.warning('Drop off location is required, Please Enter!', null);
    //   return false;
    // }
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
    if (this.bookingForm.get('bookingFor').status === 'VALID') {
      this.RouteObjInherit.booking_for_self = this.bookingForm.get('bookingFor').value;
    } else {
      this.toastr.warning('For whom you are booking ride, Please select!', null);
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
  validateFields() {
    let valdity = false;
    this.RouteObjInherit.fields.forEach((item,index) => {
      if(item.field != null) {
       if(item.value === null || item.value === '') {
        item.invalid = true;
        valdity = true;
        } else if(item.invalid = true) {
          item.invalid = false;
        } 
      }
    });
    if(valdity) {
      this.toastr.warning('Form is invalid, Please provide all details.')
      return false
    } else {
      return true;
    }
  }
  // validation ends
  // Init Form groups
  initForm() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern('^.{8,}$')
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern('^.{8,}$')
      ]),
      name: new FormControl(null, [
        Validators.required
      ]),
      phone: new FormControl(null, [
        Validators.required
      ]),
      confirmEmail: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ])
    });
    this.bookingForm = new FormGroup({
      bookingFor: new FormControl(null, [
        Validators.required
      ]),
      no_of_passengers: new FormControl(null, [
      ]),
      no_of_childs: new FormControl(null, [
      ]),
      no_of_suitCases: new FormControl(null, [
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
interface keyValue {
  name: string,
  id: number
}