import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as $ from 'jquery';
import {CosService} from '../services/cos.service';
import {AlertService} from '../services/alert.service';
import {HttpService} from '../services/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit, AfterViewInit {
  imageCount: number;
  uploadImageData: FormData;
  addImageDom = `<div class="add-photo-btn waves-ripple" mdbWavesEffect>
                    <i class="fa fa-plus" style="font-size: 30px"></i>
                 </div>`;

  albums: any;
  currentAlbum: any;

  uploading: boolean;

  constructor(private cos: CosService,
              private alert: AlertService,
              private http: HttpService,
              private router: Router) {
    this.imageCount = 0;
    this.uploadImageData = new FormData();
    this.uploading = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const that = this;
    $('.add-photo-btn').click(function () {
      that.choseImage();
    });
    this.http.getAlbums({
      start: 0,
      limit: 10000
    }, {
      onPreExecute: () => {
        $('#setAlbumBtn').text('相册信息加载中...');
      },
      onPostExecute: (data, err) => {
        $('#setAlbumBtn').text('选择相册');
        if (err === undefined && data.code === 200) {
          this.albums = data.map.albums;
        }
      }
    });
  }

  choseImage() {
    document.getElementById('image-input').click();
  }

  setAlbum(album) {
    $('#setAlbumBtn').text(`${album.title}`);
    this.currentAlbum = album;
  }


  imagesChange() {
    const imageInput = document.getElementById('image-input');
    const lengthOfImages = (imageInput as any).files.length;
    if (this.imageCount + lengthOfImages > 9) {
      // show alert info
      this.alert.show({
        type: 'warning',
        title: '提示',
        content: '一次只能上传九张照片'
      });
    } else {
      for (let index = 0; index < lengthOfImages; index++) {
        this.uploadImageData.append('photos', (imageInput as any).files[index]);
        const fileReader = new FileReader();
        fileReader.readAsDataURL((imageInput as any).files[index]);
        this.imageCount++;
        this.imageReadHandler(this.imageCount, fileReader);
      }
      if (this.imageCount < 9) {
        const id = this.imageCount + 1;
        console.log(id);
        const dom = $(this.addImageDom);
        const that = this;
        dom.click(function () {
          that.choseImage();
        });
        $(`#${id}`).append(dom);
      }
    }
  }

  imageReadHandler(index: Number, fileReader: FileReader) {
    fileReader.addEventListener('load', function () {
      const innerHtml = $(`<img src="${fileReader.result}" class="img-fluid"/>
<div class="mask white-text info-container rgba-black-strong">
</div>`);
      const div = $(`#${index}`);
      div.html('');
      div.append(innerHtml);
    });
  }

  upload() {
    const files = this.uploadImageData.getAll('photos');
    if (files.length === 0) {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '没有选择照片'
      });
      return;
    }
    if (this.currentAlbum === undefined) {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '请选择相册'
      });
      return;
    }
    let success = 0;
    const progress = $('#progress');
    progress.css('width', '0%');
    this.uploading = true;

    for (let i = 0; i <= files.length; i++) {
      const file = files[i];
      this.cos.putObject({
          Body: file,
          Name: file['name']
        }, p => {
        },
        (err, data) => {
          if (err !== undefined) {
            const photo = {
              id: -1,
              path: data.Location,
              description: '',
              latitude: 0,
              longitude: 0,
              md5: ``,
              uploadDate: '2018-11-09 12:23:32'
            };
            this.http.uploadPhoto(photo, {
              onPreExecute: () => {
              },
              onPostExecute: (r, e) => {
                if (e === undefined && r.code === 200) {
                  this.http.addPhotoToAlbum(r.map.photo.id, this.currentAlbum.id, {
                    onPreExecute: () => {
                    },
                    onPostExecute: (re, er) => {
                      if (er === undefined && re.code === 200) {
                        success++;
                        this.alert.show({
                          type: 'success',
                          title: '提示',
                          content: `上传${success}张照片成功`
                        });
                      } else {
                        this.alert.show({
                          type: 'danger',
                          title: '提示',
                          content: `上传1张照片失败`
                        });
                      }
                    }
                  });
                } else {
                  this.alert.show({
                    type: 'danger',
                    title: '提示',
                    content: `上传1张照片失败`
                  });
                }
              }
            });
          } else {
            this.alert.show({
              type: 'danger',
              title: '提示',
              content: `上传1张照片失败`
            });
          }
        });
    }
  }

  toHome() {
    this.router.navigate(['/home']);
  }

}
