import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmicustomizerComponent } from './amicustomizer.component';

describe('AmicustomizerComponent', () => {
  let component: AmicustomizerComponent;
  let fixture: ComponentFixture<AmicustomizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmicustomizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmicustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
