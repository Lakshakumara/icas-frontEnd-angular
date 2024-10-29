import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecComponent } from './mec.component';

describe('MecComponent', () => {
  let component: MecComponent;
  let fixture: ComponentFixture<MecComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MecComponent]
    });
    fixture = TestBed.createComponent(MecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
