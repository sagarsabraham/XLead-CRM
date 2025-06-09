import { TestBed } from '@angular/core/testing';

import { SeviceLineService } from './sevice-line.service';

describe('SeviceLineService', () => {
  let service: SeviceLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeviceLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
