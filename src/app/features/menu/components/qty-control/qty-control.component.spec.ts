/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QtyControlComponent } from './qty-control.component';

describe('QtyControlComponent', () => {
  let component: QtyControlComponent;
  let fixture: ComponentFixture<QtyControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtyControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
