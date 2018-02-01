import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-confirm-popup-component',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['../../layout/public/public.component.css']
})
export class ConfirmPopupComponent implements OnInit {
  @Input() confirm;
  @Input() close;

  loading = false;

  constructor(
    public router:Router
  ) { }

  ngOnInit() {
  }
  closeBox() {
      this.close();
  }
  ignoreClick(e) {
    e.stopPropagation();
  }
  yes() {
    this.loading = true;
    this.confirm();
  }
}
