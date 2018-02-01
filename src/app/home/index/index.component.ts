import { Component, OnInit } from '@angular/core';

import { Constants } from '../../constants';
import { PickupMainComponent } from '../../booking/pickup-main/pickup-main.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../../layout/index/index.component.css']
})
export class IndexHomeComponent implements OnInit {
  assetsUrl = Constants.ASSET_URL;
  constructor() { }

  ngOnInit() {
  }

}
