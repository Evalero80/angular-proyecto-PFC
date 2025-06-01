import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Almacen2Component } from './almacen2.component';

describe('Almacen2Component', () => {
  let component: Almacen2Component;
  let fixture: ComponentFixture<Almacen2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Almacen2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Almacen2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
