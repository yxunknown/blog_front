import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {
  }

  token() {
    return 'http://132.232.36.151:8089/api/login-service/login';
  }

  getArticles() {
    return 'http://132.232.36.151:8089/api/article-service/article';
  }
}
