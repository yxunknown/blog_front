import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../services/http.service';
import Nprogress from 'nprogress';
import {AlertService} from '../services/alert.service';

const TYPE_MUSIC = 9;
const TYPE_MOVIE = 8;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  type: string;
  start: number;
  articles: any;
  shouldLoadMore: boolean;

  constructor(
    private routeInfo: ActivatedRoute,
    private http: HttpService,
    private alert: AlertService
  ) {
    this.type = routeInfo.params['value'].type;
    this.start = 0;
    this.shouldLoadMore = true;
  }

  ngOnInit() {
    this.getArticle(this.start, 20);
  }

  getArticle(start, limit) {
    let select = {};
    if (this.type === 'music') {
      select = {
        start: start,
        limit: limit,
        'catalog.id': TYPE_MUSIC
      };
    } else if (this.type === 'movie') {
      select = {
        start: start,
        limit: limit,
        'catalog.id': TYPE_MOVIE
      };
    } else {
      select = {
        start: start,
        limit: limit,
      };
    }
    this.http.getArticleBySelection(select, {
      onPreExecute: () => {
        Nprogress.start();
      },
      onPostExecute: (data, err) => {
        Nprogress.done();
        if (err === undefined && data.code === 200) {
          const articles = data.map.articles;
          this.render(articles);
        } else {
          this.alert.show({
            type: 'danger',
            title: '错误',
            content: '获取文章数据出错'
          });
        }
      }
    });
  }

  render(articles) {
    this.start += 20;
    if (articles.length <= 0) {
      this.shouldLoadMore = false;
      return;
    }
    if (this.articles === undefined) {
      this.articles = [];
    }
    let year = [];
    let date = '';
    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      const yearOfa = a.datetime.substring(0, 4);
      if (date === '') {
        date = yearOfa;
        year.push(a);
      } else if (date === yearOfa) {
        year.push(a);
      } else {
        this.articles.push({
          year: date,
          articles: year
        });
        year = [];
        date = a.datetime.substring(0, 4);
        year.push(a);
      }
    }
    if (year.length > 0) {
      this.articles.push({
        year: date,
        articles: year
      });
    }
    console.log(this.articles);
  }
}
