import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecHsComponent } from './mec-hs.component';

describe('MecHsComponent', () => {
  let component: MecHsComponent;
  let fixture: ComponentFixture<MecHsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MecHsComponent]
    });
    fixture = TestBed.createComponent(MecHsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
