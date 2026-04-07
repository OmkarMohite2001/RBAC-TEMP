import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecableTreeComponent } from './checable-tree.component';

describe('ChecableTreeComponent', () => {
  let component: ChecableTreeComponent;
  let fixture: ComponentFixture<ChecableTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecableTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecableTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
