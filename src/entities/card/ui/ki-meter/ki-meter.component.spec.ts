import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiMeterComponent } from './ki-meter.component';

describe('KiMeterComponent', () => {
  let component: KiMeterComponent;
  let fixture: ComponentFixture<KiMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KiMeterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KiMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
