import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-auto-confirm-popup',
  templateUrl: './auto-confirm-popup.component.html',
  styleUrls: ['../../layout/public/public.component.css']
})
export class AutoConfirmPopupComponent implements OnInit {
  @Input() close;
  @Input() key;

  heading:string = "";
  detail:string = "";

  constructor(
    public router:Router
  ) { }

  ngOnInit() {
    this.update(this.key);
  }
  update(value) {
    if(value === 'auto-confirm') {
      this.heading = "Auto Confirmation";
      this.detail = "You will be notified once your booking is confirmed.";
    } else {
      this.heading = "Auto Confirmation";
      this.detail = "You have successfully created the booking.";
    }
  }
  closeBox() {
    this.router.navigate(['/'])
    this.close();
  }
}
