import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegPopupComponent } from './user-reg-popup.component';

describe('UserRegPopupComponent', () => {
  let component: UserRegPopupComponent;
  let fixture: ComponentFixture<UserRegPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRegPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
