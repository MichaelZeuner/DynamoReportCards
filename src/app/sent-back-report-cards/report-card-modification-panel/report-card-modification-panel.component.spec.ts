import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCardModificationPanelComponent } from './report-card-modification-panel.component';

describe('ReportCardModificationPanelComponent', () => {
  let component: ReportCardModificationPanelComponent;
  let fixture: ComponentFixture<ReportCardModificationPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCardModificationPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCardModificationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
