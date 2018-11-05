import {Injectable} from '@angular/core';
import COS from 'src/lib/cos-js-sdk-v5.min.js';

@Injectable({
  providedIn: 'root'
})
export class CosService {

  private config = {
    SecretId: 'AKIDLUO5ZoNfHTTKzPeVEixAIMDxShgQ5Lac',
    SecretKey: 'wc5IFwOcbKq68wUmobBYosiKi14rOeeO',
  };

  bucket: 'photo-1253210260';
  region: 'ap-chengdu';
  private cos: COS;

  constructor() {
    this.cos = new COS(this.config);
  }

  getUrl(key: string, callback: (err, url) => void) {
    this.cos.getObjectUrl({
      Bucket: this.bucket,
      Region: this.region,
      Key: key,
      Sign: true
    }, (err, data) => {
      // handle url here
      callback(err, data.Url);
    });
  }

  headBucket(bucket, region, callback: (err, data) => void) {
    this.cos.headBucket({
      Bucket: bucket,
      Region: region,
    }, function (err, data) {
      callback(err, data);
    });
  }

  putObject(object, progress: (progress) => void, callback: (err, data) => void) {
    const param = {
      Bucket: 'photo-1253210260',
      Region: 'ap-chengdu',
      Key: this.generateFileName(object.Name),
      StorageClass: 'STANDARD',
      Body: object.Body,
      onProgress: progress,
    };
    console.log(param);
    this.cos.putObject(param, function (err, data) {
      callback(err, data);
    });
  }

  generateFileName(name: string): string {
    const postfix = name.substr(name.lastIndexOf('.'), name.length);
    const timestamp = (new Date()).getTime();
    return timestamp + postfix;
  }


}
