import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {TokenService} from './token.service';

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
}
