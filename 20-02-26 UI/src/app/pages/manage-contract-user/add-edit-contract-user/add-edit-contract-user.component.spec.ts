import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContractUserComponent } from './add-edit-contract-user.component';

describe('AddEditContractUserComponent', () => {
  let component: AddEditContractUserComponent;
  let fixture: ComponentFixture<AddEditContractUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditContractUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditContractUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
