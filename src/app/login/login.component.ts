import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../services/api.service';
import {TokenService} from '../services/token.service';
import {e} from '@angular/core/src/render3';

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
    private api: ApiService,
    private token: TokenService) {
    this.username = '';
    this.password = '';
  }

  ngOnInit() {
  }

  login() {
    if (this.username === '' || this.password === '') {
      const alert = document.getElementById('alerter');
      console.log(alert.classList);
      alert.classList.add('show', 'show');
      console.log(alert.classList);
    } else {
      const data = new FormData();
      data.set('account', this.username.toString());
      data.set('password', this.password.toString());
      this.http.post(this.api.token(), data).subscribe(
        value => {
          status = value['info'];
          if (status === '登录成功') {
            this.token.setToken(value['map']['token']['token'], value['map']['token']['refreshToken']);
            this.token.setUser(JSON.stringify(value['map']['user']));
            this.route.navigate(['/home']);
          } else {
            alert(value['info']);
          }
        },
        error1 => {
          alert(error1);
        },
      );
    }
  }

}
