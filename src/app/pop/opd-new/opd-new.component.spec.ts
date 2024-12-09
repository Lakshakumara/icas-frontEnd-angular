import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdNewComponent } from './opd-new.component';

describe('OpdNewComponent', () => {
  let component: OpdNewComponent;
  let fixture: ComponentFixture<OpdNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpdNewComponent]
    });
    fixture = TestBed.createComponent(OpdNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
