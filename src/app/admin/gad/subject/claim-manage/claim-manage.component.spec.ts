import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimManageComponent } from './claim-manage.component';

describe('ClaimManageComponent', () => {
  let component: ClaimManageComponent;
  let fixture: ComponentFixture<ClaimManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimManageComponent]
    });
    fixture = TestBed.createComponent(ClaimManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
