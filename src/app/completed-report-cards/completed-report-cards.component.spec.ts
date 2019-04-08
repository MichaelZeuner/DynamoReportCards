import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedReportCardsComponent } from './completed-report-cards.component';

describe('CompletedReportCardsComponent', () => {
  let component: CompletedReportCardsComponent;
  let fixture: ComponentFixture<CompletedReportCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedReportCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedReportCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
