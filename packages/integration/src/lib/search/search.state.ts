import { Injectable } from '@angular/core';

import { EntityStore } from '@igo2/common';
import { SearchResult, SearchSourceService, SearchSource } from '@igo2/geo';

/**
 * Service that holds the state of the search module
 */
@Injectable({
  providedIn: 'root'
})
export class SearchState {
  /**
   * Store that holds the search results
   */
  public store: EntityStore<SearchResult> = new EntityStore<SearchResult>([]);

  /**
   * Search types currently enabled in the search source service
   */
  get searchTypes(): string[] {
    return this.searchSourceService
      .getEnabledSources()
      .map((source: SearchSource) => (source.constructor as any).type);
  }

  constructor(private searchSourceService: SearchSourceService) {}
}
