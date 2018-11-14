import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  guestToken = 'bc3e04e5d6d266e50c3e3b06a2d62f81';
  guestUser = {
    account: 'guest@qq.com',
    brief: '',
    nickname: '訪客',
    password: '********',
    status: {id: 2, description: '正常'}
  };

  constructor() {
  }

  setToken(token: string, refreshToken: string) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('refresh_token', refreshToken);
  }

  getToken(): string {
    const token = window.localStorage.getItem('token');
    if (token === undefined || token ===  null || token === '') {
      return this.guestToken;
    } else {
      return token;
    }
  }

  getRefreshToken(): string {
    return window.localStorage.getItem('refresh_token');
  }

  setUser(user: string) {
    window.localStorage.setItem('user', user);
  }

  getUser() {
    const user = window.localStorage.getItem('user');
    if (user === undefined || user === null || user === '') {
      return this.guestUser;
    } else {
      return JSON.parse(user);
    }
  }

  verifyToken(): boolean {
    const token = this.getToken();
    return token !== undefined && token !== null && token !== '' && token.length === 32;
  }

  isAdmin(): boolean {
    return this.getUser().account === 'hercats@qq.com';
  }

  isGuest() {
    return this.getUser().account === 'guest@qq.com';
  }
}
