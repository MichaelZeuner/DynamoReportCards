import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReportCardComponent } from './print-report-card.component';

describe('PrintReportCardComponent', () => {
  let component: PrintReportCardComponent;
  let fixture: ComponentFixture<PrintReportCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintReportCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
