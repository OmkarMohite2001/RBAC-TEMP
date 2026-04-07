import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignApplicationComponent } from './assign-application.component';

describe('AssignApplicationComponent', () => {
  let component: AssignApplicationComponent;
  let fixture: ComponentFixture<AssignApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
