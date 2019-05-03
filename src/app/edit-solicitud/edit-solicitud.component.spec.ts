import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSolicitudComponent } from './edit-solicitud.component';

describe('EditSolicitudComponent', () => {
  let component: EditSolicitudComponent;
  let fixture: ComponentFixture<EditSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
