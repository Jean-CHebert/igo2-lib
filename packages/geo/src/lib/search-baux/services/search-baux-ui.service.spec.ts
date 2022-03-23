import { TestBed } from '@angular/core/testing';

import { SearchBauxUiService } from './search-baux-ui.service';

describe('SearchBauxUiService', () => {
  let service: SearchBauxUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBauxUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
