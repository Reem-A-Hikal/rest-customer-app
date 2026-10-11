/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KitchenStatusService } from './kitchen-status.service';

describe('Service: KitchenStatus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KitchenStatusService]
    });
  });

  it('should ...', inject([KitchenStatusService], (service: KitchenStatusService) => {
    expect(service).toBeTruthy();
  }));
});
