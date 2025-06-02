import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessVideoComponent } from './success-video.component';

describe('SuccessVideoComponent', () => {
  let component: SuccessVideoComponent;
  let fixture: ComponentFixture<SuccessVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
