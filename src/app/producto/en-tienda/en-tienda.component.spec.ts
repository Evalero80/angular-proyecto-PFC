import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnTiendaComponent } from './en-tienda.component';

describe('EnTiendaComponent', () => {
  let component: EnTiendaComponent;
  let fixture: ComponentFixture<EnTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnTiendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
