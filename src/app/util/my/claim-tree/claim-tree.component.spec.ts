import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimTreeComponent } from './claim-tree.component';

describe('ClaimTreeComponent', () => {
  let component: ClaimTreeComponent;
  let fixture: ComponentFixture<ClaimTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimTreeComponent]
    });
    fixture = TestBed.createComponent(ClaimTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
