import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckSubscriptionsPage } from './check-subscriptions.page';

describe('CheckSubscriptionsPage', () => {
  let component: CheckSubscriptionsPage;
  let fixture: ComponentFixture<CheckSubscriptionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSubscriptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
