import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeMaterialComponent } from './free-material.component';

describe('FreeMaterialComponent', () => {
  let component: FreeMaterialComponent;
  let fixture: ComponentFixture<FreeMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
