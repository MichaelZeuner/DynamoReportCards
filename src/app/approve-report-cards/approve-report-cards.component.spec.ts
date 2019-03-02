import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReportCardsComponent } from './approve-report-cards.component';

describe('ApproveReportCardsComponent', () => {
  let component: ApproveReportCardsComponent;
  let fixture: ComponentFixture<ApproveReportCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveReportCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveReportCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
