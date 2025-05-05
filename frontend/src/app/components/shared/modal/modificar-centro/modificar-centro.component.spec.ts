import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCentroComponent } from './modificar-centro.component';

describe('ModificarCentroComponent', () => {
  let component: ModificarCentroComponent;
  let fixture: ComponentFixture<ModificarCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarCentroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
