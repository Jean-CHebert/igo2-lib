import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextPermissionsComponent } from './context-permissions.component';

describe('ContextPermissionsBaseComponent', () => {
  let component: ContextPermissionsComponent;
  let fixture: ComponentFixture<ContextPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ContextPermissionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
