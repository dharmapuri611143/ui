import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCategoryModalComponent } from './blog-category-modal.component';

describe('BlogCategoryModalComponent', () => {
  let component: BlogCategoryModalComponent;
  let fixture: ComponentFixture<BlogCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
