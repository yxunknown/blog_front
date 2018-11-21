import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TokenService} from '../services/token.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../services/api.service';
import Nprogress from 'nprogress';
import {AlertService} from "../services/alert.service";

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
  start: number;

  constructor(
    private token: TokenService,
    private http: HttpClient,
    private api: ApiService,
    private alert: AlertService) {
    this.start = 0;
  }

  ngOnInit() {
    this.isShowLoading = true;
    this.isShowLoadMore = false;
    this.isShowContent = false;
    this.getArticle(this.start, 20);
  }

  ngAfterViewInit() {
  }

  loadMore() {
    // handle load more
    this.getArticle(this.start, 20);
  }

  getArticle(start, limit) {
    Nprogress.start();
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
        Nprogress.done();
        if (value['code'] === 200) {
          // receive data successful
          // dismiss loading component and show content area
          this.isShowLoading = false;
          this.isShowContent = true;
          this.start += limit;
          if (this.articles === undefined) {
            this.articles = value['map']['articles'];
          } else {
            const newArticles = value['map']['articles'];
            for (let i = 0; i < newArticles.length; i++) {
              this.articles.push(newArticles[i]);
            }
          }
          this.isShowLoadMore = (value as any).map.articles.length > 0;
        }
      },
      error: err => {
        Nprogress.done();
        console.log(err);
        this.alert.show({
          type: 'danger',
          title: '错误',
          content: '获取文章列表出错，请重试!'
        });
      }
    });
  }
}
