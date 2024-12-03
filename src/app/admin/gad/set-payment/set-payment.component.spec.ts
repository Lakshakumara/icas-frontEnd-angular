import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPaymentComponent } from './set-payment.component';

describe('SetPaymentComponent', () => {
  let component: SetPaymentComponent;
  let fixture: ComponentFixture<SetPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetPaymentComponent]
    });
    fixture = TestBed.createComponent(SetPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
