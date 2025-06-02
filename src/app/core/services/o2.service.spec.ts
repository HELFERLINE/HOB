import { TestBed } from '@angular/core/testing';

import { O2Service } from './o2.service';

describe('O2Service', () => {
  let service: O2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(O2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
