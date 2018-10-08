import {Component, OnInit} from '@angular/core';

import $ from 'jquery';
import {d} from '@angular/core/src/render3';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit {
  imageCount: number;
  uploadImageData: FormData;
  addImageDom = '<i class="fa fa-plus" style="font-size: 30px"></i>';

  constructor() {
    this.imageCount = 0;
    this.uploadImageData = new FormData();
  }

  ngOnInit() {
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
    } else {
      for (let index = this.imageCount; index < lengthOfImages; index++) {
        this.uploadImageData.append('photos', (imageInput as any).files[index]);
        const fileReader = new FileReader();
        fileReader.readAsDataURL((imageInput as any).files[index]);
        this.imageReadHandler(index + 1, fileReader);
      }
      this.imageCount += lengthOfImages;
    }
  }

  imageReadHandler(index: Number, fileReader: FileReader) {

    console.log(index);
    fileReader.addEventListener('load', function () {
      const innerHtml = $(`<img src="${fileReader.result}" class="img-fluid"/>
              <div class="mask white-text info-container rgba-black-strong">
                <span>enmmm...</span>
              </div>`);
      const div = $(`#${index}`);
      div.html('');
      div.click(function () {
        console.log('hh');
      })
      div.append(innerHtml);
    });
  }

}
