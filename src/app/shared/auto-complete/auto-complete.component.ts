import { Component, ElementRef, NgZone, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-auto-complete-component',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
@Input() key;
@Input() setFunc;

  public searchControl: FormControl;
  public zoom: number;

  public latitude: number;
  public longitude: number;

  @ViewChild('search')
  // @ViewChild("start")
  // @ViewChild("end")

  public searchElementRef: ElementRef;
  search = '';
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
     const autocomplete_options = {
        types: ['(regions)'],
        componentRestrictions: { country: "uk" }
      }
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, autocomplete_options);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          // if(this.key != 'waypoint'){
          //   this.setFunc(this.key,this.searchElementRef.nativeElement.value)
          // } else {
          //   place.geometry.name = this.searchElementRef.nativeElement.value
          this.setFunc(this.key, place)
          // }
        });
      });
    });
  }
  clear() {
    this.searchElementRef.nativeElement.value = '';
  }
}
