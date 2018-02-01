import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { UserService } from '../user.service';
import { LoaderComponent } from '../../../app/shared/loader/loader.component'
import { Constants } from '../../constants';

@Component({
  selector: 'app-reset-password-component',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../layout/public/public.component.css']
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private toastr:ToastsManager,
  ) { }
  assetsUrl = Constants.ASSET_URL;
  loading = false;
  data: string;
  verifyResponse = false;
  resetForm:FormGroup
  model:any = {};
  accessToken: string;
  successreset = false;
  loginEnable = false;

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.verifyTokken) {
       this.accessToken = params.verifyTokken;
      }
    });
    if (this.accessToken != ":") {
      this.verify(this.accessToken);
    } else {
      this.router.navigate(['/']);
    }
    this.initForm();
    this.skipCheck = this.skipCheck.bind(this);
    this.closeLogin = this.closeLogin.bind(this);
  }
  initForm(){
    this.resetForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern("^.{5,}$")
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern("^.{5,}$")
      ]),
    });
  }
  verify(accessToken) {
    this.loading = true;
    this.userService.verify(accessToken)
      .subscribe(data => {
        this.verifyResponse = true;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.verifyResponse = false;
      })
  }
  resetSubmit(){
    if (this.resetForm.get('password').status == 'VALID') {
      this.model.password = this.resetForm.get('password').value;
    } else {
      this.toastr.warning("Password is required, Enter valid password", null);
    }
    if (this.resetForm.get('confirmPassword').status == 'VALID') {
      this.model.confirmPassword = this.resetForm.get('confirmPassword').value;
    } else {
      this.toastr.warning("Password is required, Enter valid confirm password", null);
    }
    if(this.model.password == this.model.confirmPassword && this.model.password != null){
      this.resetPassword(this.model);
    } else {
      this.toastr.warning("Password do not match!", null);
     }
  }
  resetPassword(model){
    this.loading = true;
    delete this.model.confirmPassword
    this.model.token = this.accessToken
    this.userService.resetPassword(this.model)
    .subscribe(data => {
      let res = data.json();
      this.loading = false;
      this.successreset = true;
    })
  }
  navigate(){
    this.router.navigate([''])
  }
  ignoreClick(e) {
    e.stopPropagation();
  }
  login() {
    this.loginEnable = true;
  }
  skipCheck() {
    this.navigate();
  }
  closeLogin() {
    this.loginEnable = !this.loginEnable;
    this.navigate();
  }
}
