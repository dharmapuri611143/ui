import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenConfigComponent } from './gen-config.component';

describe('GenConfigComponent', () => {
  let component: GenConfigComponent;
  let fixture: ComponentFixture<GenConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
