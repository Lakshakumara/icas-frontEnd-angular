import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimUpdateComponent } from './claim-update.component';

describe('ClaimUpdateComponent', () => {
  let component: ClaimUpdateComponent;
  let fixture: ComponentFixture<ClaimUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimUpdateComponent]
    });
    fixture = TestBed.createComponent(ClaimUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
