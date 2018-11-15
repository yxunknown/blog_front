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

  getArticleCount() {
    return `${BASE_URL}/${API_PREFIX}/article-provider/article/count`;
  }

  getArticleCountBySelection() {
    return `${BASE_URL}/${API_PREFIX}/article-provider/article/counts`;
  }

  getAlbums() {
    return `${BASE_URL}/${API_PREFIX}/album-provider/album`;
  }

  addAlbums() {
    return `${BASE_URL}/${API_PREFIX}/album-provider/album`;
  }

  addPhotoToAlbum() {
    return `${BASE_URL}/${API_PREFIX}/photo-provider/photo`;
  }

  getAlbumPhotos() {
    return `${BASE_URL}/${API_PREFIX}/photo-provider/photo/album`;
  }

  getCards() {
    return `${BASE_URL}/${API_PREFIX}/card-provider/card`;
  }
  addCard() {
    return `${BASE_URL}/${API_PREFIX}/card-provider/card`;
  }
}
