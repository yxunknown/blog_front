import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../services/storage.service';
import {ActivatedRoute} from '@angular/router';
import marked from 'marked';
import hljs from 'highlight.js';
import * as $ from 'jquery';

@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.scss']
})
export class ListArticleComponent implements OnInit, AfterViewInit {

  article: any;

  @ViewChild('articleContainer') articleContainer: ElementRef;
  @ViewChild('bg') bg: ElementRef;

  constructor(
    private storage: StorageService,
    private routeInfo: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const articleId = this.routeInfo.params['value'].id;
    console.log(articleId);
    this.article = this.storage.getArticle(articleId);
  }

  ngAfterViewInit() {
    this.bg.nativeElement.style.backgroundImage = `url(${this.article.cover.path})`;
    this.articleContainer.nativeElement.innerHTML = marked(this.article.content);
    $('pre code').each((i, block) => {
      hljs.highlightBlock(block);
    });
  }

}
