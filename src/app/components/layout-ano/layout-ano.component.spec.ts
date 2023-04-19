import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutAnoComponent } from './layout-ano.component';

describe('LayoutAnoComponent', () => {
  let component: LayoutAnoComponent;
  let fixture: ComponentFixture<LayoutAnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutAnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutAnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
