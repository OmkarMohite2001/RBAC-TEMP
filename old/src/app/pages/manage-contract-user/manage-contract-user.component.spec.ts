import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContractUserComponent } from './manage-contract-user.component';

describe('ManageContractUserComponent', () => {
  let component: ManageContractUserComponent;
  let fixture: ComponentFixture<ManageContractUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageContractUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageContractUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
