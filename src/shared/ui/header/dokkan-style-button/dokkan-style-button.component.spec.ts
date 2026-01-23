import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DokkanStyleButtonComponent } from './dokkan-style-button.component';

describe('DokkanStyleButtonComponent', () => {
  let component: DokkanStyleButtonComponent;
  let fixture: ComponentFixture<DokkanStyleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DokkanStyleButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DokkanStyleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
