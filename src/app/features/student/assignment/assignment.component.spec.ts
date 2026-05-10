import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentComponent } from './assignment.component';

describe('AssignmentComponent', () => {
  let component: AssignmentComponent;
  let fixture: ComponentFixture<AssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
