import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchParametersBauxComponent } from './search-parameters-baux.component';

describe('SearchParametersBauxComponent', () => {
  let component: SearchParametersBauxComponent;
  let fixture: ComponentFixture<SearchParametersBauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchParametersBauxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchParametersBauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
