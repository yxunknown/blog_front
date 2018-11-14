import {Component, OnInit} from '@angular/core';
import * as PhotoSwipe from 'node_modules/photoswipe/dist/photoswipe.js';
import * as Default_UI from 'node_modules/photoswipe/dist/photoswipe-ui-default.js';
import {StorageService} from '../services/storage.service';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../services/http.service';
import {AlertService} from '../services/alert.service';
import * as $ from 'jquery';
import {CosService} from '../services/cos.service';
import {TokenService} from '../services/token.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {

  album: any;
  file: File;
  start: number;
  photos = [];
  photoPreview = [];
  photoCount: number;
  currentPage = 1;
  totalPage = 1;
  isAdmin: boolean;
  isLoading: boolean;
  constructor(private storage: StorageService,
              private routeInfo: ActivatedRoute,
              private http: HttpService,
              private alert: AlertService,
              private token: TokenService,
              private cos: CosService) {
    this.album = this.storage.getAlbum(routeInfo.params['value'].id);
    this.start = 0;
    this.photoCount = 0;
    this.isLoading = true;
    this.isAdmin = this.token.isAdmin();
  }

  ngOnInit() {
    this.http.getAlbumPhotos(this.album.id, {
      start: this.start,
      limit: 16
    }, {
      onPreExecute: () => { this.isLoading = true},
      onPostExecute: ((data, err) => {
        this.isLoading = false;
        if (err === undefined && data.code === 200) {
          this.photoCount = data.map.count;
          this.totalPage = Math.ceil(this.photoCount / 16);
          this.renderPhoto(data.map.photos);
        }
      })
    });
  }

  preview(index) {
    console.log(index);
    const s = document.querySelectorAll('.pswp')[0];
    const option = {
      index: index,
      hideAnimationDuration: 200,
      showAnimationDuration: 200
    };
    const gallery = new PhotoSwipe(s, Default_UI, this.photoPreview, option);
    (gallery as any).init();
  }

  fileChange() {
    const fileObj = document.getElementById('file-chose');
    this.file = (fileObj as any).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.addEventListener('load', function () {
      const img = document.getElementById('photo-previewer');
      img.setAttribute('src', reader.result);
    });
  }

  uploadPhoto() {
    const title = $('#imageDesc').val();
    if (this.file === undefined) {
      this.alert.show({
        type: 'warning',
        title: '提示',
        content: '请选择要上传的图片'
      });
    }
    if (title === '') {
      this.alert.show({
        type: 'warning',
        title: '提示',
        content: '请输入描述'
      });
    }
    $('#imageTip').text('照片上传中...');
    this.cos.putObject({
        Name: this.file.name,
        Body: this.file
      }, progress => {
      },
      (err, data) => {
        if (err !== undefined) {
          const photo = {
            id: -1,
            path: data.Location,
            description: `${title}`,
            latitude: 0,
            longitude: 0,
            md5: `${data.Etag}`,
            uploadDate: '2018-11-09 12:23:32'
          };
          this.http.uploadPhoto(photo, {
            onPreExecute: () => {},
            onPostExecute: (result, error) => {
              if (error === undefined && result.code === 200) {
                this.http.addPhotoToAlbum(result.map.photo.id, this.album.id, {
                  onPreExecute: () => {},
                  onPostExecute: (data1, err1) => {
                    $('#imageTip').text('');
                    if (err1 === undefined && data1.code === 200) {
                      this.alert.show({
                        type: 'success',
                        title: '提示',
                        content: '上传照片成功'
                      });
                    } else {
                      this.alert.show({
                        type: 'danger',
                        title: '提示',
                        content: '上传照片失败'
                      });
                    }
                  }
                });
              } else {
                $('#imageTip').text('照片上传失败...');
              }
            }
          });
        } else {
          $('#imageTip').text('照片上传失败...');
        }
      });
  }

  renderPhoto(photos) {
    this.photos = [];
    let col = [];
    for (let i = 1; i <= photos.length; i++) {
      col.push(photos[i - 1]);
      this.photoPreview.push({
        src: `${photos[i - 1].path}`,
        w: 1280,
        h: 720,
        title: `${photos[i - 1].description}`,
      });
      if (i % 4 === 0) {
        this.photos.push(col);
        col = [];
      }
    }
    if (col.length > 0) {
      this.photos.push(col);
    }
  }
}
