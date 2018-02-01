import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteNavigateComponent } from './quote-navigate.component';

describe('QuoteNavigateComponent', () => {
  let component: QuoteNavigateComponent;
  let fixture: ComponentFixture<QuoteNavigateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteNavigateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteNavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
