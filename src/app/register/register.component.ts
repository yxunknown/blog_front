import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  account: FormControl;
  password: FormControl;
  rePassword: FormControl;

  constructor(private router: Router) {
    this.account = new FormControl('',[
      Validators.email,
      Validators.minLength(1),
      Validators.required
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);
    this.rePassword = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);
  }

  ngOnInit() {
  }

  register() {
    // todo: request server
    this.router.navigate(['login']);
  }

  back() {
    // back to pre page
  }

}
