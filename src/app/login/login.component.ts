import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';

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
    private http: HttpClient) {
    this.username = '';
    this.password = '';
  }

  ngOnInit() {
  }

  login() {
    // todo: request to login
    if (this.username === '' || this.password === '') {
      const alert = document.getElementById('alerter');
      alert.classList.add('show');
    }
    const body = {
      account: this.username,
      password: this.password
    };
    this.http.post('http://45.77.16.125:8085/login', body).subscribe(
      {
        next: function (data) {
          console.log(data);
        },
        error: function (err) {
          console.log(err);
        }
      }
    );
    // after login
    // this.route.navigate(['/home']);
  }

}
