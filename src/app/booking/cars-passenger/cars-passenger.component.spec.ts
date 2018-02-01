import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsPassengerComponent } from './cars-passenger.component';

describe('CarsPassengerComponent', () => {
  let component: CarsPassengerComponent;
  let fixture: ComponentFixture<CarsPassengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarsPassengerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
