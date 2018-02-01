import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// App Guard
import { AppGuard } from './app.guard'
import { CanDeactivateGuard } from './can-deactivate.guard';
// Users Module
import { ProfileComponent } from '../users/profile/profile.component';
import { VerifyComponent } from '../users/verify/verify.component';
import { ResetPasswordComponent } from '../users/reset-password/reset-password.component';
// Layout Module
import { PublicComponent } from '../layout/public/public.component';
import { IndexComponent } from '../layout/index/index.component';
import { IndexNewComponent } from '../layout/index-new/index-new.component';
// Home Module
import { IndexHomeComponent } from '../home/index/index.component';
import { HomeNewComponent } from '../home/home-new/home-new.component'
// Booking module
import { QuoteComponent } from '../booking/quote/quote.component';
import { VehiclePassengerComponent } from '../booking/vehicle-passenger/vehicle-passenger.component';
import { SummaryComponent } from '../booking/summary/summary.component'
import { PaymentComponent } from '../booking/payment/payment.component';
import { CarsPassengerComponent } from '../booking/cars-passenger/cars-passenger.component';
import { QuoteNewComponent } from '../booking/quote-new/quote-new.component';
import { SummaryNewComponent } from '../booking/summary-new/summary-new.component';

const routes: Routes = [
    // {
    //     path: 'login',
    //     component: PublicComponent
    // },
    {
        path:'',
        component: IndexNewComponent,
        children: [
            {path: '', component: HomeNewComponent},
            {path: 'quote', component: QuoteNewComponent, canDeactivate:[CanDeactivateGuard]},
            {path: 'passengers', component: CarsPassengerComponent, canDeactivate:[CanDeactivateGuard]},
            {path: 'summary', component: SummaryNewComponent},
            {path: 'payment', component: PaymentComponent},
            {path: 'profile', component: ProfileComponent},
            { path: 'verify/:verifyTokken', component: VerifyComponent },
            { path:'reset/:verifyTokken',component: ResetPasswordComponent}
        ]
    },
    {
        path: 'home',
        component: IndexComponent,
        children: [
            {path: '', component: IndexHomeComponent},
            {path: 'quote', component: QuoteComponent},
            {path: 'passengers', component: VehiclePassengerComponent},
            {path: 'summary', component: SummaryComponent},
            {path: 'payment', component: PaymentComponent},
            {path: 'profile', component: ProfileComponent}
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
