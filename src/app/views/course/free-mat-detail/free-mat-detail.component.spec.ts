import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeMatDetailComponent } from './free-mat-detail.component';

describe('FreeMatDetailComponent', () => {
  let component: FreeMatDetailComponent;
  let fixture: ComponentFixture<FreeMatDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeMatDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeMatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
