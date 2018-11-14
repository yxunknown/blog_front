import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../services/api.service';
import {TokenService} from '../services/token.service';
import {e} from '@angular/core/src/render3';
import {AlertService} from '../services/alert.service';

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
    private token: TokenService,
    private alert: AlertService) {
    this.username = '';
    this.password = '';
  }

  ngOnInit() {
  }

  login() {
    if (this.username === '' || this.password === '') {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '用户名或密码为空'
      });
    } else {
      const data = new FormData();
      data.set('account', this.username.toString());
      data.set('password', this.password.toString());
      this.alert.show({
        type: 'success',
        title: '提示',
        content: '正在登录中,请稍候....'
      });
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
          this.alert.show({
            type: 'danger',
            title: '提示',
            content: '登录失敗'
          });
        },
      );
    }
  }

  toHome() {
    this.route.navigate(['/home']);
  }

}
