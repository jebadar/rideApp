import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../user.service';
import { LoaderComponent } from '../../../app/shared/loader/loader.component'
import { Constants } from '../../constants';

@Component({
  selector: 'app-verify-component',
  templateUrl: './verify.component.html',
  styleUrls: ['../../layout/public/public.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }
  assetsUrl = Constants.ASSET_URL;

  returnUrl = "";
  data: string;

  verifyResponse = false;
  loginEnable = false;
  loading = false;
  response = false;

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || 'register';
    let accessToken: string;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.verifyTokken) {
        accessToken = params.verifyTokken;
      }
    });
    if (accessToken != ":") {
      this.verify(accessToken);
    } else {
      this.router.navigate(['/']);
    }
    this.skipCheck = this.skipCheck.bind(this);
    this.closeLogin = this.closeLogin.bind(this);
  }
  verify(accessToken) {
    this.loading = true;
    this.userService.verify(accessToken)
      .subscribe(data => {
        this.verifyResponse = true;
        this.loading = false;
      },
      err => {
        let error = err.json();
        this.loading = false;
        this.verifyResponse = false;
      })
  }
  navigate(){
    this.router.navigate([''])
  }
  login() {
    this.loginEnable = true;
  }
  ignoreClick(e) {
    e.stopPropagation();
  }
  skipCheck() {
   this.navigate();
  }
  closeLogin() {
    this.loginEnable = !this.loginEnable;
    this.navigate();
  }
}
