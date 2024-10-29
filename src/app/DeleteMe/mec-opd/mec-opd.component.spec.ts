import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecOpdComponent } from './mec-opd.component';

describe('MecOpdComponent', () => {
  let component: MecOpdComponent;
  let fixture: ComponentFixture<MecOpdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MecOpdComponent]
    });
    fixture = TestBed.createComponent(MecOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
