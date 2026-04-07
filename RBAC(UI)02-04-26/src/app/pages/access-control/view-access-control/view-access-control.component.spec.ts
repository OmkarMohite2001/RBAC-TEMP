import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccessControlComponent } from './view-access-control.component';

describe('ViewAccessControlComponent', () => {
  let component: ViewAccessControlComponent;
  let fixture: ComponentFixture<ViewAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAccessControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
