import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPasswordResetComponent } from './find-password-reset.component';

describe('FindPasswordResetComponent', () => {
  let component: FindPasswordResetComponent;
  let fixture: ComponentFixture<FindPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
