/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeliveryZoneService } from './delivery-zone.service';

describe('Service: DeliveryZone', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryZoneService]
    });
  });

  it('should ...', inject([DeliveryZoneService], (service: DeliveryZoneService) => {
    expect(service).toBeTruthy();
  }));
});
