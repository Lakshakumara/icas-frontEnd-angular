import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantDataComponent } from './dependant-data.component';

describe('DependantDataComponent', () => {
  let component: DependantDataComponent;
  let fixture: ComponentFixture<DependantDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DependantDataComponent]
    });
    fixture = TestBed.createComponent(DependantDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
