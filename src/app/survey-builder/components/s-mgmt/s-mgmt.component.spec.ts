import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SMgmtComponent } from './s-mgmt.component';

describe('SMgmtComponent', () => {
  let component: SMgmtComponent;
  let fixture: ComponentFixture<SMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
