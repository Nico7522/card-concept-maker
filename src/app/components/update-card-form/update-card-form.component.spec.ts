import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCardFormComponent } from './update-card-form.component';

describe('UpdateCardFormComponent', () => {
  let component: UpdateCardFormComponent;
  let fixture: ComponentFixture<UpdateCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCardFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
