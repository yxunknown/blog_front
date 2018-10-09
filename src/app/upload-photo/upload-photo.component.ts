import {Component, OnInit, AfterViewInit } from '@angular/core';

import $ from 'jquery';

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

  constructor() {
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
  }

  choseImage() {
    document.getElementById('image-input').click();
  }

  imagesChange() {
    const imageInput = document.getElementById('image-input');
    const lengthOfImages = (imageInput as any).files.length;
    if (this.imageCount + lengthOfImages > 9) {
      // show alert info
      $('.alert')[0].classList.add('show');
      $('.close').click(function () {
        $('.alert')[0].classList.remove('show');
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

}