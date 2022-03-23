import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLayerResultsBauxComponent } from './search-layer-results-baux.component';

describe('SearchLayerResultsBauxComponent', () => {
  let component: SearchLayerResultsBauxComponent;
  let fixture: ComponentFixture<SearchLayerResultsBauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLayerResultsBauxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLayerResultsBauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
