/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DishImageComponent } from './dish-image.component';

describe('DishImageComponent', () => {
  let component: DishImageComponent;
  let fixture: ComponentFixture<DishImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
