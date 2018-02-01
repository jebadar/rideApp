import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePassengerComponent } from './vehicle-passenger.component';

describe('VehiclePassengerComponent', () => {
  let component: VehiclePassengerComponent;
  let fixture: ComponentFixture<VehiclePassengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclePassengerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclePassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
