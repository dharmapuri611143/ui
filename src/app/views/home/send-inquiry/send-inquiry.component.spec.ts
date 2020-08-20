import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInquiryComponent } from './send-inquiry.component';

describe('SendInquiryComponent', () => {
  let component: SendInquiryComponent;
  let fixture: ComponentFixture<SendInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
