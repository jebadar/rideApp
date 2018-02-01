import { NgModule } from '@angular/core';
// App Modules
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastModule} from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Local Modules
import { AppRoutingModule } from './app-routing/app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { AppGuard } from './app-routing/app.guard'
import { HomeModule } from './home/home.module'
import { CanDeactivateGuard } from './app-routing/can-deactivate.guard'
// Local Services
import { LocalStoreService } from './app-services/local-store.service'
import { UserService } from './users/user.service'
import { HttpService } from './app-services/http.service'
import { BookingService } from './booking/booking.service'
// Components
import { AppComponent } from './app.component';
// directives

@NgModule({
  declarations: [
   AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    HomeModule
  ],
  providers: [
    AppGuard,
    UserService,
    HttpService,
    LocalStoreService,
    BookingService,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
