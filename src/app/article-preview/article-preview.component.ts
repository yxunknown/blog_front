import {AfterViewInit, Component, OnInit} from '@angular/core';

import $ from 'jquery';
@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss']
})
export class ArticlePreviewComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).scroll(function () {
      const height = document.body.clientHeight;
      const scrollHeight = document.body.scrollHeight;
      console.log(height);
      console.log(scrollHeight);
    });
  }

}
