import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../services/http.service';
import * as $ from 'jquery';
import {CosService} from '../services/cos.service';
import {AlertService} from '../services/alert.service';
import {StorageService} from '../services/storage.service';
import {TokenService} from '../services/token.service';
import Nprogress from 'nprogress';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  start: number;
  albumSet: any;
  currentPage: number;
  albumCount: number;
  isCoverUploading: boolean;
  coverId: any;
  isAdmin: boolean;

  constructor(private route: Router,
              private http: HttpService,
              private cos: CosService,
              private alert: AlertService,
              private storage: StorageService,
              private token: TokenService) {
    this.start = 0;
    this.currentPage = 1;
    this.albumCount = 0;
    this.isCoverUploading = false;
    this.coverId = '';
    this.isAdmin = this.token.isAdmin();
  }

  ngOnInit() {
    this.getAlbums(this.start,  9);
  }

  getAlbums(start, limit) {
    this.http.getAlbums({
      start: start,
      limit: limit}, {
      onPreExecute: () => {
        Nprogress.start();
      },
      onPostExecute: ((data, err) => {
        Nprogress.done();
        if (err === undefined && data.code === 200) {
          this.albumCount = data.map.count;
          this.renderAlbums(data.map.albums);
        } else {
          this.alert.show({
            type: 'danger',
            title: '提示',
            content: '获取相册数据失败'
          });
        }
      })
    });
  }
  detail(album) {
    this.storage.setAlbum(album.id, album);
    this.route.navigate(['/album/', album.id]);
  }

  choseCover() {
    const coverInput = document.getElementById('cover-chose');
    coverInput.click();
  }
  fileChange() {
    $('#tips').text('');
    const fileObj = document.getElementById('cover-chose');
    const file = (fileObj as any).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', function () {
      const img = document.getElementById('cover-previewer');
      img.setAttribute('src', reader.result);
    });
    $('#tips').text('封面上传中...');
    this.isCoverUploading = true;
    this.cos.putObject({
      Body: file,
      Name: file.name
    }, progress => console.log(progress),
      (err, data) => {
        if (err === undefined) {
          $('#tips').text('上传封面失败...');
        } else {
          const photo = {
            id: -1,
            path: data.Location,
            description: '相册封面',
            latitude: 0,
            longitude: 0,
            md5: `${data.Etag}`,
            uploadDate: ''
          };
          this.http.uploadPhoto(photo, {
            onPreExecute: () => {},
            onPostExecute: (result, error) => {
              this.isCoverUploading = false;
              console.log(result || error);
              if (error === undefined && result.code === 200) {
                $('#tips').text('');
                this.coverId = result.map.photo.id;
              } else {
                this.coverId = '';
                $('#tips').text('上传封面失败...');
              }
            }
          });
        }
      });
  }

  renderAlbums(albums) {
    this.albumSet = [];
    let set = [];
    for (let i = 1; i <= albums.length; i++) {
      set.push(albums[i - 1]);
      if (i % 3 === 0) {
        this.albumSet.push(set);
        set = [];
      }
    }
    if (set.length > 0) {
      this.albumSet.push(set);
    }
    console.log(this.albumSet);
  }

  getPages(): number {
    return Math.ceil(this.albumCount / 9);
  }

  pre() {
    if (this.currentPage - 1 < 1) {
      this.alert.show({
        type: 'warning',
        title: '提示',
        content: '已经是第一页了'
      });
      return;
    } else {
      this.currentPage--;
      this.getAlbums((this.currentPage - 1) * 9, 9);
    }
  }
  post() {
    if (this.currentPage + 1 > this.getPages()) {
      this.alert.show({
        type: 'warning',
        title: '提示',
        content: '已经是最后一页了'
      });
      return;
    } else {
      this.currentPage++;
      this.getAlbums((this.currentPage - 1) * 9, 9);
    }
  }

  addAlbum() {
    const album = {
      title: `${$('#titleOfAlbum').val()}`,
      description: `${$('#descOfAlbum').val()}`,
      cover: this.coverId
    };
    this.http.addAlbum(album, {
      onPreExecute: () => {},
      onPostExecute: ((data, err) => {
        if (err === undefined && data.code === 200) {
          this.alert.show({
            type: 'success',
            title: '提示',
            content: '创建相册成功'
          });
        } else {
          this.alert.show({
            type: 'danger',
            title: '提示',
            content: '创建相册失败'
          });
        }
      })
    });
  }
}
