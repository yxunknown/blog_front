import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TokenService} from '../services/token.service';
import {DialogService} from '../services/dialog.service';
import {HttpService} from '../services/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  articleCount: number;
  musicCount: number;
  movieCount: number;
  isAdmin: boolean;

  constructor(
    private token: TokenService,
    private dialog: DialogService,
    private http: HttpService,
    private route: Router
  ) {
    this.isAdmin = this.token.isAdmin();
  }

  ngOnInit() {
    this.dialog.onPositiveClick(() => {
      this.dialog.show('close');
    });
  }

  ngAfterViewInit() {
    this.http.getArticleCount({
      onPreExecute: () => {
      },
      onPostExecute: (data, err) => {
        if (err === undefined && data.code === 200) {
          this.articleCount = data.map.count;
        } else {
          this.articleCount = 0;
        }
      }
    });
    this.http.getArticleCountBySelect({'catalog.id': 9}, {
      onPreExecute: () => {
      },
      onPostExecute: (data, err) => {
        if (err === undefined && data.code === 200) {
          this.musicCount = data.map.count;
        } else {
          this.movieCount = 0;
        }
      }
    });
    this.http.getArticleCountBySelect({'catalog.id': 8}, {
      onPreExecute: () => {
      },
      onPostExecute: (data, err) => {
        if (err === undefined && data.code === 200) {
          this.movieCount = data.map.count;
        } else {
          this.movieCount = 0;
        }
      }
    });
  }

  toBlack() {
    this.route.navigate(['/card/black']);
  }

  toWritor() {
    this.route.navigate(['/article/write']);
  }

  toUpload() {
    this.route.navigate(['/photo/upload']);
  }
}
