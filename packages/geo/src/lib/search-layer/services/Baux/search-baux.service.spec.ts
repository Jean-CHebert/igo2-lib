import { TestBed } from '@angular/core/testing';

import { SearchBauxService } from './search-baux.service';

describe('SearchBauxService', () => {
  let service: SearchBauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
