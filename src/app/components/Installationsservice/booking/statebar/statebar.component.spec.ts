import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatebarComponent } from './statebar.component';

describe('StatebarComponent', () => {
  let component: StatebarComponent;
  let fixture: ComponentFixture<StatebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
