import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInmuebleComponent } from './edit-inmueble.component';

describe('EditInmuebleComponent', () => {
  let component: EditInmuebleComponent;
  let fixture: ComponentFixture<EditInmuebleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInmuebleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
