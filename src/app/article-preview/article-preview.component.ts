import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TokenService} from '../services/token.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../services/api.service';

import marked from 'marked';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss']
})
export class ArticlePreviewComponent implements OnInit, AfterViewInit {
  isShowLoadMore: boolean;
  isShowLoading: boolean;
  isShowContent: boolean;
  articles: any;

  constructor(
    private token: TokenService,
    private http: HttpClient,
    private api: ApiService) {

  }

  ngOnInit() {
    this.isShowLoading = true;
    this.isShowLoadMore = false;
    this.isShowContent = false;
    this.getArticle(0, 20);
  }

  ngAfterViewInit() {
    console.log(marked('# hhello  \n dwadawd'));
  }

  loadMore() {
    // handle load more
  }

  parseMarkdownToHtml(target, markdown) {
    console.log(target);
    console.log(markdown);
  }

  getArticle(start, limit) {
    const header = {
      authorization: `Bearer ${this.token.getToken()}`
    };
    const params = {
      start: start,
      limit: limit
    };
    this.http.get(this.api.getArticles(), {
      headers: header,
      params: params
    }).subscribe({
      next: value => {
        if (value['code'] === 200) {
          // receive data successful
          // dismiss loading component and show content area
          this.isShowLoading = false;
          this.isShowContent = true;
          if (this.articles === undefined) {
            this.articles = value['map']['articles'];
            this.isShowLoadMore = this.articles.length > 0;
          } else {
            const newArticles = value['map']['articles'];
            this.isShowLoadMore = newArticles.length > 0;
            this.articles.push(newArticles);
          }
        }
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  showAllContent(target, article) {
    console.log(target.path[1]);
    console.log(article);
  }
}
