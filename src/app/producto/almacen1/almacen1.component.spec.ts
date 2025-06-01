import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Almacen1Component } from './almacen1.component';

describe('Almacen1Component', () => {
  let component: Almacen1Component;
  let fixture: ComponentFixture<Almacen1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Almacen1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Almacen1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
