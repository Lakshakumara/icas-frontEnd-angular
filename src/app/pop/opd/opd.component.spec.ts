import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdComponent } from './opd.component';

describe('OpdComponent', () => {
  let component: OpdComponent;
  let fixture: ComponentFixture<OpdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpdComponent]
    });
    fixture = TestBed.createComponent(OpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
