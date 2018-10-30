import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(
    private route: Router,
    private http: HttpClient,
    private api: ApiService) {
    this.username = '';
    this.password = '';
  }

  ngOnInit() {
  }

  login() {
    // todo: request to login
    if (this.username === '' || this.password === '') {
      const alert = document.getElementById('alerter');
      console.log(alert.classList);
      alert.classList.add('show', 'show');
      console.log(alert.classList);
    } else {
      const data = new FormData();
      data.set('account', this.username.toString());
      data.set('password', this.password.toString());
      this.http.post(this.api.tokoen(), data).subscribe(
        value => {
          console.log(value);
        },
        error1 => {
          console.log(error1);
        },
        () => {
          console.log('request completed');
        }
      );
      // after login
      // this.route.navigate(['/home']);
    }
  }

}
