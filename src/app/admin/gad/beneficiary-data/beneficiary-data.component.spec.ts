import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryDataComponent } from './beneficiary-data.component';

describe('BeneficiaryDataComponent', () => {
  let component: BeneficiaryDataComponent;
  let fixture: ComponentFixture<BeneficiaryDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiaryDataComponent]
    });
    fixture = TestBed.createComponent(BeneficiaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
