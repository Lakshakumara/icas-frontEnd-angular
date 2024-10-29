import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemePlanComponent } from './scheme-plan.component';

describe('SchemePlanComponent', () => {
  let component: SchemePlanComponent;
  let fixture: ComponentFixture<SchemePlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemePlanComponent]
    });
    fixture = TestBed.createComponent(SchemePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
