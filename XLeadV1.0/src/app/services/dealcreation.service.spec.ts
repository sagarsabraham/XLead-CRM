import { TestBed } from '@angular/core/testing';

import { DealService } from './dealcreation.service';

describe('DealcreationService', () => {
  let service: DealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
