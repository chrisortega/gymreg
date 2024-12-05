import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GymUserCheckPage } from './gym-user-check.page';

describe('GymUserCheckPage', () => {
  let component: GymUserCheckPage;
  let fixture: ComponentFixture<GymUserCheckPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GymUserCheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
