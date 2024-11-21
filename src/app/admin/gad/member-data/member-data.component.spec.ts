import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDataComponent } from './member-data.component';

describe('MemberDataComponent', () => {
  let component: MemberDataComponent;
  let fixture: ComponentFixture<MemberDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberDataComponent]
    });
    fixture = TestBed.createComponent(MemberDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
