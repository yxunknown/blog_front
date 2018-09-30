import { Component, OnInit } from '@angular/core';
import * as PhotoSwipe from 'node_modules/photoswipe/dist/photoswipe.js';
import * as Default_UI from 'node_modules/photoswipe/dist/photoswipe-ui-default.js';
@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  preview() {
    const s = document.querySelectorAll('.pswp')[0];
    const items = [{
      src: '../../assets/imgs/pho.jpeg',
      w: 1280,
      h: 720,
      title: 'dadsada',
      author: 'chengpiao'
    },
      {
        src: '../../assets/imgs/pho.jpeg',
        w: 1280,
        h: 720
      }];
    const option = {
      index: 0,
      hideAnimationDuration: 200,
      showAnimationDuration: 200
    };
    const gallery = new PhotoSwipe(s, Default_UI, items, option);
    (gallery as any).init();
  }
}
