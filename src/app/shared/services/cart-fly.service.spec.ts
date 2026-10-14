/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CartFlyService } from './cart-fly.service';

describe('Service: CartFly', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartFlyService]
    });
  });

  it('should ...', inject([CartFlyService], (service: CartFlyService) => {
    expect(service).toBeTruthy();
  }));
});
