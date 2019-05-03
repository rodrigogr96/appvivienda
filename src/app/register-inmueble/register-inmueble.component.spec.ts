import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInmuebleComponent } from './register-inmueble.component';

describe('RegisterInmuebleComponent', () => {
  let component: RegisterInmuebleComponent;
  let fixture: ComponentFixture<RegisterInmuebleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterInmuebleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
