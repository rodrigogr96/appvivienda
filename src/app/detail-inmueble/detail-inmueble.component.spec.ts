import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInmuebleComponent } from './detail-inmueble.component';

describe('DetailInmuebleComponent', () => {
  let component: DetailInmuebleComponent;
  let fixture: ComponentFixture<DetailInmuebleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInmuebleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
