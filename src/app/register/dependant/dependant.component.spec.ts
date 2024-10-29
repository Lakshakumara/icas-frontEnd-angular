import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantComponent } from './dependant.component';

describe('DependantComponent', () => {
  let component: DependantComponent;
  let fixture: ComponentFixture<DependantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DependantComponent]
    });
    fixture = TestBed.createComponent(DependantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
