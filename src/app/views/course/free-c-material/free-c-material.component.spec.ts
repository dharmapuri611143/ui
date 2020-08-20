import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeCMaterialComponent } from './free-c-material.component';

describe('FreeMaterialComponent', () => {
  let component: FreeCMaterialComponent;
  let fixture: ComponentFixture<FreeCMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeCMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeCMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
