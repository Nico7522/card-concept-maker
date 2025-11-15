import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseStatFormComponent } from './base-stat-form.component';

describe('BaseStatFormComponent', () => {
  let component: BaseStatFormComponent;
  let fixture: ComponentFixture<BaseStatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseStatFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseStatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
