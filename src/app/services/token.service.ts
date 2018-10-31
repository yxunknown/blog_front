import { Injectable } from '@angular/core';
import {getToken} from 'codelyzer/angular/styles/cssLexer';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  setToken(token: string, refreshToken: string) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('refresh_token', refreshToken);
  }
  getToken(): string {
    return window.localStorage.getItem('token');
  }
  getRefreshToken(): string {
    return window.localStorage.getItem('refresh_token');
  }
  setUser(user: string) {
    window.localStorage.setItem('user', user)
  }
  getUser() {
    return JSON.parse(window.localStorage.getItem('user'));
  }
  verifyToken(): boolean {
    const token = this.getToken();
    return token !== undefined && token !== null && token !== '' && token.length === 32;
  }
}
