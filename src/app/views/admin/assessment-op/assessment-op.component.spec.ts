import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentOpComponent } from './assessment-op.component';

describe('AssessmentOpComponent', () => {
  let component: AssessmentOpComponent;
  let fixture: ComponentFixture<AssessmentOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
