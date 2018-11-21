import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {TokenService} from './token.service';
import {until} from 'selenium-webdriver';
import {e, s} from "@angular/core/src/render3";

interface HttpServiceHandler {
  onPreExecute: () => void;
  onPostExecute: (data, err) => void;
}

interface Photo {
  id: number;
  path: string;
  description: string;
  latitude: number;
  longitude: number;
  md5: string;
  uploadDate: string;
}

interface Article {
  author: string;
  title: string;
  content: string;
  datetime: string;
  cover: string;
  tag: string;
  catalog: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  authorization: any;

  constructor(private http: HttpClient,
              private api: ApiService,
              private token: TokenService) {
    this.authorization = {
      authorization: `Bearer ${this.token.getToken()}`
    };
  }

  getArticleCatalog(handler: HttpServiceHandler) {
    handler.onPreExecute();
    this.http.get(this.api.getArticleCatalogs(), {
      headers: this.authorization
    }).subscribe({
      next: value => {
        handler.onPostExecute(value, undefined);
      },
      error: err => {
        handler.onPostExecute(undefined, err);
      }
    });
  }

  addArticleCatalog(catalog: string, handler: HttpServiceHandler) {
    handler.onPreExecute();
    const body = new FormData();
    body.set('catalog', catalog);
    this.http.post(this.api.addArticleCatalogs(), body, {
      headers: this.authorization
    }).subscribe({
      next: value => {
        handler.onPostExecute(value, undefined);
      },
      error: err => {
        handler.onPostExecute(undefined, err);
      }
    });
  }

  uploadPhoto(photo: Photo, handler: HttpServiceHandler) {
    handler.onPreExecute();
    const body = new FormData();
    body.set('path', photo.path);
    body.set('description', photo.description);
    body.set('latitude', `${photo.latitude}`);
    body.set('longitude', `${photo.longitude}`);
    body.set('md5', photo.md5);
    this.http.post(this.api.uploadPhoto(), body, {
      headers: this.authorization
    }).subscribe({
      next: value => {
        handler.onPostExecute(value, undefined);
      },
      error: err => {
        handler.onPostExecute(undefined, err);
      }
    });
  }

  addArticle(article: Article, handler: HttpServiceHandler) {
    handler.onPreExecute();
    const body = new FormData();
    body.set('author.account', article.author);
    body.set('title', article.title);
    body.set('content', article.content);
    body.set('tag', article.tag);
    body.set('cover.id', article.cover);
    body.set('catalog.id', article.catalog);
    this.http.post(this.api.addArticle(), body, {
      headers: this.authorization
    }).subscribe({
      next: value => {
        handler.onPostExecute(value, undefined);
      },
      error: err => {
        handler.onPostExecute(undefined, err);
      }
    });
  }

  getArticleCount(handler: HttpServiceHandler) {
    this.http.get(this.api.getArticleCount(), {
      headers: this.authorization
    }).subscribe({
      next: value => {
        handler.onPostExecute(value, undefined);
      },
      error: err => {
        handler.onPostExecute(undefined, err);
      }
    });
  }

  getArticleCountBySelect(selection, handler: HttpServiceHandler) {
    handler.onPreExecute();
    this.http.get(this.api.getArticleCountBySelection(), {
      headers: this.authorization,
      params: selection
    }).subscribe({
      next: value => {
        handler.onPostExecute(value, undefined);
      },
      error: err => {
        handler.onPostExecute(undefined, err);
      }
    });
  }

  getAlbums(pagination, handler: HttpServiceHandler) {
    handler.onPreExecute();
    this.http.get(this.api.getAlbums(), {
      headers: this.authorization,
      params: pagination
    }).subscribe({
      next: value => handler.onPostExecute(value, undefined),
      error: err => handler.onPostExecute(undefined, err)
    });
  }

  addAlbum(album, handler: HttpServiceHandler) {
    handler.onPreExecute();
    const body = new FormData();
    body.set('title', album.title);
    body.set('description', album.description);
    body.set('cover.id', album.cover);
    this.http.post(this.api.addAlbums(), body, {
      headers: this.authorization
    }).subscribe({
      next: value => handler.onPostExecute(value, undefined),
      error: err => handler.onPostExecute(undefined, err)
    });
  }

  addPhotoToAlbum(photoId, albumId, handler: HttpServiceHandler) {
    handler.onPreExecute();
    const url = `${this.api.addPhotoToAlbum()}/${photoId}/${albumId}`;
    this.http.post(url, {}, {
      headers: this.authorization
    }).subscribe({
      next: value => handler.onPostExecute(value, undefined),
      error: err => handler.onPostExecute(undefined, err)
    });
  }

  getAlbumPhotos(albumId, pagination, handler: HttpServiceHandler) {
    handler.onPreExecute();
    const url = `${this.api.getAlbumPhotos()}/${albumId}`;
    this.http.get(url, {
      headers: this.authorization,
      params: pagination
    }).subscribe({
      next: value => handler.onPostExecute(value, undefined),
      error: err => handler.onPostExecute(undefined, err)
    });
  }

  getCards(pagination, handler: HttpServiceHandler) {
    handler.onPreExecute();
    this.http.get(this.api.getCards(), {
      headers: this.authorization,
      params: pagination
    }).subscribe({
      next: value => handler.onPostExecute(value, undefined),
      error: err => handler.onPostExecute(undefined, err)
    });
  }

  addCard(card, handler: HttpServiceHandler) {
    handler.onPreExecute();
    const body = new FormData();
    body.set('content', card.content);
    body.set('author.account', card.author);
    this.http.post(this.api.addCard(), body, {
      headers: this.authorization
    }).subscribe({
      next: value => handler.onPostExecute(value, undefined),
      error: err => handler.onPostExecute(undefined, err)
    });
  }

  getTime(handle: HttpServiceHandler) {
    handle.onPreExecute();
    this.http.get(this.api.getTime()).subscribe({
      next: value => handle.onPostExecute(value, undefined),
      error: err => handle.onPostExecute(undefined, err)
    });
  }

  getArticleBySelection(selection, handler: HttpServiceHandler) {
    handler.onPreExecute();
    this.http.get(this.api.getArticleBySelection(), {
      params: selection,
      headers: this.authorization
    }).subscribe({
      next: value => handler.onPostExecute(value, undefined),
      error: err => handler.onPostExecute(undefined, err)
    });
  }

}
