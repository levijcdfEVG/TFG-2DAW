import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEducadorComponent } from './info-educador.component';

describe('InfoEducadorComponent', () => {
  let component: InfoEducadorComponent;
  let fixture: ComponentFixture<InfoEducadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoEducadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoEducadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
