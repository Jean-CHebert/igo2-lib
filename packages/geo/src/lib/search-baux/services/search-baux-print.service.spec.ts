import { TestBed } from '@angular/core/testing';

import { SearchBauxPrintService } from './search-baux-print.service';

describe('SearchBauxPrintService', () => {
  let service: SearchBauxPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBauxPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
