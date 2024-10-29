import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysplitterComponent } from './mysplitter.component';

describe('MysplitterComponent', () => {
  let component: MysplitterComponent;
  let fixture: ComponentFixture<MysplitterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MysplitterComponent]
    });
    fixture = TestBed.createComponent(MysplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
