import {GoogleMapsAPIWrapper} from '@agm/core';
import { Directive,  Input, OnInit } from '@angular/core';
import { debug } from 'util';
declare var google: any;

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'agm-map-directions'
})
export class DirecDirective implements OnInit {
  @Input() origin;
  @Input() destination;
  @Input() waypoint;
  @Input() directionsDisplay: any;

  waypoints = [];
  directionCheck = false;

  constructor (private gmapsApi: GoogleMapsAPIWrapper) {}
  ngOnInit() {
    if (this.directionsDisplay === undefined) {
      this.directionCheck = true;
      } else if (this.directionsDisplay !== undefined) {
        this.directionCheck = false;
      }
    if (this.origin !== undefined && this.destination !== undefined) {
      this.updateLocation(this.origin, this.destination, this.waypoint)
    }
  }
  updateLocation(origin, destination, waypoint) {
    this.waypoints = [];
    if (origin.formatted_address !== undefined) {
      this.origin = origin.formatted_address;
    } else {
      this.origin = origin;
    }
    if (destination.formatted_address !== undefined) {
      this.destination = destination.formatted_address;
    } else {
      this.destination = destination;
    }
      this.waypoint = waypoint;
      if (this.waypoint !== '') {
        this.waypoint.forEach(item => {
          if (item.formatted_address !== undefined) {
            this.waypoints.push({
              // location: new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng())
              location: item.formatted_address
            })
          } else if (item.formatted_address === undefined) {
            this.waypoints.push({
              location: item
            })
          }
        });
      }
      this.gmapsApi.getNativeMap().then(map => {
        if (this.directionCheck) {
          /* tslint:disable-next-line */
          var directionsDisplayNew = new google.maps.DirectionsRenderer({
            draggable: true,
            map: map,
        });
        directionsDisplayNew.setMap(map);
        } else if (!this.directionCheck) {
          this.directionsDisplay.setMap(map);
        }
        const directionsService = new google.maps.DirectionsService;
        directionsService.route({
                origin: this.origin,
                destination: this.destination,
                waypoints: this.waypoints,
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
              }, function(response, status) {
                          if (status === 'OK') {
                            if (!this.directionCheck) {
                              this.directionsDisplay.setDirections(response);
                            } else if (this.directionCheck) {
                              directionsDisplayNew.setDirections(response);
                            }
                          } else {
                            // window.alert('Directions request failed due to ' + status);
                          }
        }.bind(this));

});
  }
}
export const DIRECTION_DIRECTIVES = [DirecDirective];
