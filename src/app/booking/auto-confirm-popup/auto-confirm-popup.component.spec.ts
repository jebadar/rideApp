import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoConfirmPopupComponent } from './auto-confirm-popup.component';

describe('AutoConfirmPopupComponent', () => {
  let component: AutoConfirmPopupComponent;
  let fixture: ComponentFixture<AutoConfirmPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoConfirmPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoConfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
