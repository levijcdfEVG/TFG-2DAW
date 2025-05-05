import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaCentroComponent } from './alta-centro.component';

describe('AltaCentroComponent', () => {
  let component: AltaCentroComponent;
  let fixture: ComponentFixture<AltaCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaCentroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
