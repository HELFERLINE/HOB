import { TestBed } from '@angular/core/testing';

import { onlineService } from './o2.service';

describe('onlineService', () => {
  let service: onlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(onlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
