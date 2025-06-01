import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Almacen3Component } from './almacen3.component';

describe('Almacen3Component', () => {
  let component: Almacen3Component;
  let fixture: ComponentFixture<Almacen3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Almacen3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Almacen3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
