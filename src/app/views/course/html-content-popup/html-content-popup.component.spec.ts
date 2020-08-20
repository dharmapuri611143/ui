import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlContentPopupComponent } from './html-content-popup.component';

describe('HtmlContentPopupComponent', () => {
  let component: HtmlContentPopupComponent;
  let fixture: ComponentFixture<HtmlContentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlContentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlContentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
