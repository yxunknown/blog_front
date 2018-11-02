import { Injectable } from '@angular/core';
import COS from 'src/lib/cos-js-sdk-v5.min.js';

@Injectable({
  providedIn: 'root'
})
export class CosService {

  private config = {
    SecretId: 'AKIDLUO5ZoNfHTTKzPeVEixAIMDxShgQ5Lac',
    SecretKey: 'wc5IFwOcbKq68wUmobBYosiKi14rOeeO',
  };
  private cos: COS;
  constructor() {
    this.cos = new COS(this.config);
  }
  getUrl(key: string) {
    this.cos.getObjectUrl({
      Bucket: 'photo-1253210260',
      Region: 'ap-chengdu',
      Key: key,
      Sign: true
    }, (err, data) => {
      // handle url here
      console.log(err || data.Url);
    });
  }



}
