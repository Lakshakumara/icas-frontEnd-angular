import { TestBed } from '@angular/core/testing';

import { SwalHelperService } from './swal-helper.service';

describe('SwalHelperService', () => {
  let service: SwalHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwalHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
