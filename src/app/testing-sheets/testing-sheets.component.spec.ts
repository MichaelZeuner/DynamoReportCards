import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingSheetsComponent } from './testing-sheets.component';

describe('TestingSheetsComponent', () => {
  let component: TestingSheetsComponent;
  let fixture: ComponentFixture<TestingSheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingSheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
