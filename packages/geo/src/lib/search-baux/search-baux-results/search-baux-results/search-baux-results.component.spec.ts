import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBauxResultsComponent } from './search-baux-results.component';

describe('SearchBauxResultsComponent', () => {
  let component: SearchBauxResultsComponent;
  let fixture: ComponentFixture<SearchBauxResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBauxResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBauxResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
