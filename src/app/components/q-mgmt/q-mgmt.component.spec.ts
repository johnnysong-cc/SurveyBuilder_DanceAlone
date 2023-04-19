import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QMgmtComponent } from './q-mgmt.component';

describe('QMgmtComponent', () => {
  let component: QMgmtComponent;
  let fixture: ComponentFixture<QMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
