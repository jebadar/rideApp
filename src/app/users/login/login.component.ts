import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../layout/public/public.component.css']
})
export class LoginComponent implements OnInit {
  @Input() close;
  @Input() belongs_to;
  @Input() setUser;
  @Input() skipCheck;

  loginForm: FormGroup;
  model: any = {};

  returnUrl: string;

  reset = false;
  successSendReset = 'false';
  loading = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastsManager
  ) { }

  ngOnInit() {
    this.userService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9!#$%&\'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$')
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern('^.{5,}$')
      ])
    });
  }
  login() {
    if (this.loginForm.get('email').status === 'VALID') {
      this.model.email = this.loginForm.get('email').value;
    } else {
      this.toastr.warning(
        'Email is required, Use valid email address',
        null,
        { tapToDismiss: true ,
          closeButton: true,
          showDuration: 300,
          hideDuration: 1000,
          timeOut: 5000,
          extendedTimeOut: 1000,
          showCloseButton: true
        }
      );
      return;
    }
    if(!this.reset) {
      if (this.loginForm.get('password').status === 'VALID') {
      this.model.password = this.loginForm.get('password').value;
      } else {
        this.toastr.warning(
          'Enter valid password, Min 5 charaters',
          null,
          { tapToDismiss: true,
            closeButton: true,
            showDuration: 300,
            hideDuration: 1000,
            timeOut: 5000,
            extendedTimeOut: 1000,
            showCloseButton: true
          }
        );
        return;
      }
    }
    if (this.loginForm.status === 'VALID' && !this.loading && !this.reset) {
    this.loading = true;
    this.userService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          const res = data;
          if (this.setUser !== undefined) {
            this.setUser(res);
          }
          if (this.belongs_to === 'main') {
            this.close();
          } else {
            this.router.navigate([''])
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      )
    } else if (this.reset) {
      this.resetSubmit();
    }
  }
  resetSubmit() {
    if (!this.loading) {
      this.loading = true;
      this.successSendReset = 'false'
      this.userService.forgetPassword(this.model.email)
        .subscribe(
          data => {
            this.reset = false;
            this.successSendReset = 'true';
            this.loading = false;
          },
          error => {
            this.reset = false;
            this.successSendReset = 'error';
            this.loading = false;
          }
        )
    }

  }
  forgetPassword() {
    this.reset = true;
    this.successSendReset = 'false'
  }
  setFlag(value: boolean) {
    this.reset = value;
  }
  closeBox() {
    this.close();
  }
  skip() {
    this.skipCheck()
  }
  ignoreClick(e) {
    e.stopPropagation();
  }
}
