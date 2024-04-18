import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevsPage } from './devs.page';

describe('DevsPage', () => {
  let component: DevsPage;
  let fixture: ComponentFixture<DevsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DevsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
