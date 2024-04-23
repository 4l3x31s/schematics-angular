import { TestBed } from '@angular/core/testing';

import { MyLibAlexeisService } from './my-lib-alexeis.service';

describe('MyLibAlexeisService', () => {
  let service: MyLibAlexeisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyLibAlexeisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
