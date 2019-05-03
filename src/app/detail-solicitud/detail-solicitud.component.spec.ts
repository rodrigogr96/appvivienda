import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSolicitudComponent } from './detail-solicitud.component';

describe('DetailSolicitudComponent', () => {
  let component: DetailSolicitudComponent;
  let fixture: ComponentFixture<DetailSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
