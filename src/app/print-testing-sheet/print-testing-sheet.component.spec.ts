import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTestingSheetComponent } from './print-testing-sheet.component';

describe('PrintTestingSheetComponent', () => {
  let component: PrintTestingSheetComponent;
  let fixture: ComponentFixture<PrintTestingSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTestingSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTestingSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
