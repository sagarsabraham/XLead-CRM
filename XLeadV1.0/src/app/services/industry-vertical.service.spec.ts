import { TestBed } from '@angular/core/testing';

import { IndustryVerticalService } from './industry-vertical.service';

describe('IndustryVerticalService', () => {
  let service: IndustryVerticalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndustryVerticalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
