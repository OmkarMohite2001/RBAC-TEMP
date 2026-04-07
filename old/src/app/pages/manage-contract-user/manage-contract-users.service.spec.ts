import { TestBed } from '@angular/core/testing';

import { ManageContractUsersService } from './manage-contract-users.service';

describe('ManageContractUsersService', () => {
  let service: ManageContractUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageContractUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
