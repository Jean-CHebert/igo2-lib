import { TestBed } from '@angular/core/testing';

import { SearchLayerUiService } from './search-layer-ui.service';

describe('SearchLayerUiService', () => {
  let service: SearchLayerUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchLayerUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
