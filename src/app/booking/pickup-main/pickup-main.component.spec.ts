import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupMainComponent } from './pickup-main.component';

describe('PickupMainComponent', () => {
  let component: PickupMainComponent;
  let fixture: ComponentFixture<PickupMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
