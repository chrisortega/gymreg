import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GymadminPage } from './gymadmin.page';

describe('GymadminPage', () => {
  let component: GymadminPage;
  let fixture: ComponentFixture<GymadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GymadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
