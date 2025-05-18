import { TestBed } from '@angular/core/testing';

import { RelatedInfoService } from './related-info.service';

describe('RelatedInfoService', () => {
  let service: RelatedInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelatedInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
