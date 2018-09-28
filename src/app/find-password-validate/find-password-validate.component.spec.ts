import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPasswordValidateComponent } from './find-password-validate.component';

describe('FindPasswordValidateComponent', () => {
  let component: FindPasswordValidateComponent;
  let fixture: ComponentFixture<FindPasswordValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPasswordValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPasswordValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
