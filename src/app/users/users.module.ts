import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
  // Components
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './edit/edit.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
  // Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InfiniteScrollModule
  ],

  declarations: [
    LoginComponent,
    LogoutComponent,
    ProfileComponent,
    EditComponent,
    VerifyComponent,
    ResetPasswordComponent
  ],
  exports: [ LoginComponent, LogoutComponent ]
})
export class UsersModule { }
