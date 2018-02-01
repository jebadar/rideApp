import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupMainNewComponent } from './pickup-main-new.component';

describe('PickupMainNewComponent', () => {
  let component: PickupMainNewComponent;
  let fixture: ComponentFixture<PickupMainNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupMainNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupMainNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
