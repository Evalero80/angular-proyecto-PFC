import { TestBed } from '@angular/core/testing';

import { TiendatechService } from './tiendatech.service';

describe('TiendatechService', () => {
  let service: TiendatechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiendatechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
