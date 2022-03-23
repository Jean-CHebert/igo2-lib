import { TestBed } from '@angular/core/testing';

import { MapImageBauxService } from './map-image-baux.service';

describe('MapImageBauxService', () => {
  let service: MapImageBauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapImageBauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
