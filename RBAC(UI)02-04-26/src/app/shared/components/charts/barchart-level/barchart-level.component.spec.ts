import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartLevelComponent } from './barchart-level.component';

describe('BarchartLevelComponent', () => {
  let component: BarchartLevelComponent;
  let fixture: ComponentFixture<BarchartLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarchartLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarchartLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
