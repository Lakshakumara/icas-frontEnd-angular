import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipSelectorComponent } from './chip-selector.component';

describe('ChipSelectorComponent', () => {
  let component: ChipSelectorComponent;
  let fixture: ComponentFixture<ChipSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChipSelectorComponent]
    });
    fixture = TestBed.createComponent(ChipSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
