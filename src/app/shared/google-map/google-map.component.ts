import { Component, OnInit, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { DirecDirective } from '../direc-directive';
import {GoogleMapsAPIWrapper} from '@agm/core';
import { Input } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-google-map-component',
  templateUrl: './google-map.component.html',
  styleUrls: ['../../layout/index/index.component.css']
})
export class GoogleMapComponent implements OnInit {
  @Input() origin;
  @Input() destination;
  @Input() waypoint;
  @Input() changeFunc;
  @ViewChild(DirecDirective) vc: DirecDirective;

  zoom = 4
  waypoints = [];
  directionsDisplay: any;
  showDirective;
  loadMap = false
  constructor(
    private mapsAPILoader: MapsAPILoader
  ) {
    this.mapsAPILoader.load().then(map => {
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.loadMap = true;
  });
   }
  ngOnInit() {
    this.changeFunc.update = this.changeValue.bind(this);
  }
  changeValue = function (origin, destination, waypoints) {
    this.vc.updateLocation(origin, destination, waypoints)
  }
}
