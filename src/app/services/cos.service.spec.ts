import { TestBed } from '@angular/core/testing';

import { CosService } from './cos.service';

describe('CosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CosService = TestBed.get(CosService);
    expect(service).toBeTruthy();
  });
});
