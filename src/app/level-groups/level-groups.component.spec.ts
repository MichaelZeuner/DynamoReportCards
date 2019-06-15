import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelGroupsComponent } from './level-groups.component';

describe('LevelGroupsComponent', () => {
  let component: LevelGroupsComponent;
  let fixture: ComponentFixture<LevelGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
