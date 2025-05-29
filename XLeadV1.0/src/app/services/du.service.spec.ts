import { TestBed } from '@angular/core/testing';

import { DuService } from './du.service';

describe('DuService', () => {
  let service: DuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
