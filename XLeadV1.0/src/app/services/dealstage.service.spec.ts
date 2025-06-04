import { TestBed } from '@angular/core/testing';

import { DealstageService } from './dealstage.service';

describe('DealstageService', () => {
  let service: DealstageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealstageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
