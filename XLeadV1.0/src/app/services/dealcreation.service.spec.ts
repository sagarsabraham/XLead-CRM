import { TestBed } from '@angular/core/testing';

import { DealcreationService } from './dealcreation.service';

describe('DealcreationService', () => {
  let service: DealcreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealcreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
