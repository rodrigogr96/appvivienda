import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSolicitudComponent } from './register-solicitud.component';

describe('RegisterSolicitudComponent', () => {
  let component: RegisterSolicitudComponent;
  let fixture: ComponentFixture<RegisterSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
