/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckoutConfigService } from './checkout-config.service';

describe('Service: CheckoutConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckoutConfigService]
    });
  });

  it('should ...', inject([CheckoutConfigService], (service: CheckoutConfigService) => {
    expect(service).toBeTruthy();
  }));
});
