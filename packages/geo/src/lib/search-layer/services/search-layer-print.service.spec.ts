import { TestBed } from '@angular/core/testing';

import { SearchLayerPrintService } from './search-layer-print.service';

describe('SearchLayerPrintService', () => {
  let service: SearchLayerPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchLayerPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
