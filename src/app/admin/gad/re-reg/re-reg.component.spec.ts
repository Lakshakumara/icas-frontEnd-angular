import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReRegComponent } from './re-reg.component';

describe('ReRegComponent', () => {
  let component: ReRegComponent;
  let fixture: ComponentFixture<ReRegComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReRegComponent]
    });
    fixture = TestBed.createComponent(ReRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
