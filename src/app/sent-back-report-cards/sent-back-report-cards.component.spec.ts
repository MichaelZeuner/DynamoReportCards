import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentBackReportCardsComponent } from './sent-back-report-cards.component';

describe('SentBackReportCardsComponent', () => {
  let component: SentBackReportCardsComponent;
  let fixture: ComponentFixture<SentBackReportCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentBackReportCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentBackReportCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
