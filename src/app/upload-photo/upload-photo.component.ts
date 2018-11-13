import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as $ from 'jquery';
import {CosService} from '../services/cos.service';
import {AlertService} from '../services/alert.service';
import {HttpService} from '../services/http.service';

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

  constructor(private cos: CosService,
              private alert: AlertService,
              private http: HttpService) {
    this.imageCount = 0;
    this.uploadImageData = new FormData();
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
  }


  imagesChange() {
    const imageInput = document.getElementById('image-input');
    const lengthOfImages = (imageInput as any).files.length;
    if (this.imageCount + lengthOfImages > 9) {
      // show alert info
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
  <div class="input-group input-group-sm mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="photo-name">照片名称</span>
    </div>
    <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="photo-name">
  </div>
  <div class="input-group input-group-sm mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="photo-desc">照片信息</span>
    </div>
    <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="photo-desc">
  </div>
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
    } else {
      const file = files[0];
      this.cos.putObject({
        Body: file,
        Name: file['name'],
      }, progress => {
        console.log(progress);
      }, (err, data) => {
        console.log(err || data.Location);
      });
    }
    this.alert.show({
      type: 'success',
      title: '提示',
      content: `上传${files.length}张照片成功`
    });
  }

}
