import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit.component.html',
  styleUrls: ['../../layout/public/public.component.css']
})
export class EditComponent implements OnInit {
  @Input() close;
  userForm: FormGroup;
  user: any = {};

  password;
  confirmPass;

  loading = false;

  constructor(
    private userService: UserService,
    public toastr: ToastsManager
  ) { }

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    this.initForm()
    this.userForm.get('name').setValue(this.user.name);
    this.userForm.get('phone').setValue(this.user.cell_no);
  }
  initForm() {
    this.userForm = new FormGroup({
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
      phone: new FormControl(null, [
        Validators.required
      ])
    });
  }
  update() {
    if (this.userForm.get('name').status === 'VALID') {
      this.user.name = this.userForm.get('name').value;
    } else {
      this.toastr.warning('Name is required, Please enter name', null);
      return;
    }
    if (this.userForm.get('password').status === 'VALID') {
      this.password = this.userForm.get('password').value;
    } else {
      this.toastr.warning('Enter valid password, Min 5 charaters', null);
      return;
    }
    if (this.userForm.get('phone').status === 'VALID') {
      this.user.cell_no = this.userForm.get('phone').value;
    } else {
      this.toastr.warning('Phone number is required, Please enter.', null);
      return;
    }
    if (this.userForm.get('confirmPassword').status === 'VALID') {
      this.confirmPass = this.userForm.get('confirmPassword').value;
    } else {
      this.toastr.warning('Enter valid confirm password, Min 5 charaters', null);
      return;
    }
    if (this.userForm.status === 'VALID') {
      if (this.password === this.confirmPass) {
        this.submitUser()
      } else  {
        this.toastr.warning('Passwords not matched!', null);
        return;
      }
    }
  }
  submitUser() {
    this.loading = true;
    this.userService.editUser(this.user)
    .subscribe(data => {
      this.user = data[0];
      this.loading = false;
      this.close();
    })
  }
  ignoreClick(e) {
    e.stopPropagation();
  }
  closePopup() {
    this.close()
  }
}
