import {Injectable} from '@angular/core';

const BASE_URL = 'http://132.232.36.151:8089';
const API_PREFIX = 'api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {
  }

  token() {
    return `${BASE_URL}/${API_PREFIX}/login-service/login`;
  }

  getArticles() {
    return `${BASE_URL}/${API_PREFIX}/article-service/article`;
  }

  addArticle() {
    return `${BASE_URL}/${API_PREFIX}/article-service/article`;
  }

  getArticleCatalogs() {
    return `${BASE_URL}/${API_PREFIX}/article-service/article/catalog`;
  }

  addArticleCatalogs() {
    return `${BASE_URL}/${API_PREFIX}/article-service/article/catalog`;
  }

  uploadPhoto() {
    return `${BASE_URL}/${API_PREFIX}/photo-provider/photo`;
  }
}
