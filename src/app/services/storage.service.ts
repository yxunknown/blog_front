import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  storageArticle(title, article) {
    window.localStorage.setItem(title, JSON.stringify(article));
  }

  getArticle(title) {
    return JSON.parse(window.localStorage.getItem(title));
  }
  setAlbum(id, album) {
    window.localStorage.setItem(id, JSON.stringify(album));
  }
  getAlbum(id) {
    return JSON.parse(window.localStorage.getItem(id));
  }


}
