import { TestBed } from '@angular/core/testing';

import { GravatarServiceService } from './gravatar-service.service';

describe('GravatarServiceService', () => {
  let service: GravatarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravatarServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
