import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryOpComponent } from './category-op.component';

describe('CategoryOpComponent', () => {
  let component: CategoryOpComponent;
  let fixture: ComponentFixture<CategoryOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
