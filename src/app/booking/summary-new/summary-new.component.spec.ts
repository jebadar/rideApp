import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryNewComponent } from './summary-new.component';

describe('SummaryNewComponent', () => {
  let component: SummaryNewComponent;
  let fixture: ComponentFixture<SummaryNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
