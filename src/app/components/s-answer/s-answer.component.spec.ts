import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SAnswerComponent } from './s-answer.component';

describe('SAnswerComponent', () => {
  let component: SAnswerComponent;
  let fixture: ComponentFixture<SAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SAnswerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
