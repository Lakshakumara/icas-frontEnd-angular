import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDetailsDialogComponent } from './claim-details-dialog.component';

describe('ClaimDetailsDialogComponent', () => {
  let component: ClaimDetailsDialogComponent;
  let fixture: ComponentFixture<ClaimDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(ClaimDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
