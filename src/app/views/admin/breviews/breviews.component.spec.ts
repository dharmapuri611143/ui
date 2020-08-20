import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreviewsComponent } from './breviews.component';

describe('BreviewsComponent', () => {
  let component: BreviewsComponent;
  let fixture: ComponentFixture<BreviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
