import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFocusedBauxComponent } from './search-focused-baux.component';

describe('SearchFocusedBauxComponent', () => {
  let component: SearchFocusedBauxComponent;
  let fixture: ComponentFixture<SearchFocusedBauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFocusedBauxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFocusedBauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
