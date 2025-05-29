import { TestBed } from '@angular/core/testing';

import { RevenuetypeService } from './revenuetype.service';

describe('RevenuetypeService', () => {
  let service: RevenuetypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevenuetypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
