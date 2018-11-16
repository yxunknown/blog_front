import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../services/http.service';

import * as $ from 'jquery';
import {AlertService} from '../services/alert.service';
import {TokenService} from '../services/token.service';
import {CosService} from '../services/cos.service';
import Nprogress from 'nprogress';

@Component({
  selector: 'app-black-card',
  templateUrl: './black-card.component.html',
  styleUrls: ['./black-card.component.scss']
})
export class BlackCardComponent implements OnInit {

  showContent: Boolean = false;
  cards: any;
  start: number;
  cardBg: File;

  isLoadMore: boolean;
  isAdmin: boolean;


  constructor(
    private route: Router,
    private http: HttpService,
    private alert: AlertService,
    private token: TokenService,
    private cos: CosService) {
    this.start = 0;
    this.isLoadMore = true;
    this.isAdmin = this.token.isAdmin();
  }

  ngOnInit() {
  }

  getCard(start, limit) {
    this.http.getCards({
      start: start,
      limit: limit
    }, {
      onPreExecute: () => {
        Nprogress.start();
      },
      onPostExecute: ((data, err) => {
        Nprogress.done();
        if (err === undefined && data.code === 200) {
          if (this.cards === undefined) {
            this.cards = data.map.cards;
          } else {
            for (let i = 0; i < data.map.cards.length; i++) {
              this.cards.push(data.map.cards[i]);
            }
          }
          this.start += 20;
          this.isLoadMore = data.map.cards.length > 0;
          if (!this.isLoadMore) {
            this.alert.show({
              type: 'danger',
              title: '提示',
              content: '没有数据辣...'
            });
          }
        } else {
          console.log(err);
          this.alert.show({
            type: 'danger',
            title: '提示',
            content: '获取数据出错'
          });
        }
      })
    });
  }

  backHome() {
    this.route.navigate(['/home']);
  }

  enter() {
    this.showContent = true;
    this.getCard(this.start, 20);
  }

  cardBgChange() {
    const input = document.getElementById('cardBgInput');
    const file = (input as any).files[0] as File;
    this.cardBg = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      $('#cardBgPreviewer').attr('src', reader.result);
    });
  }

  addCard() {
    this.alert.show({
      type: 'warning',
      title: '提示',
      content: '正在创建小黑卡'
    });
    const input = $('#cardContent');
    if (input.val() === '') {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '小黑卡内容为空'
      });
      return;
    }
    if (this.cardBg === undefined || this.cardBg === null) {
      const content = {
        content: `${input.val()}`,
        url: ''
      };
      const author = this.token.getUser().account;
      this.http.addCard({
        content: `${JSON.stringify(content)}`,
        author: `${author}`
      }, {
        onPreExecute: () => {
          Nprogress.start();
        },
        onPostExecute: (result, error) => {
          Nprogress.done();
          if (error === undefined && result.code === 200) {
            this.alert.show({
              type: 'success',
              title: '提示',
              content: '创建卡片成功'
            });
          } else {
            this.alert.show({
              type: 'danger',
              title: '提示',
              content: '创建卡片失败'
            });
          }
        }
      });
    } else {
      this.cos.putObject({
          Body: this.cardBg,
          Name: this.cardBg.name
        }, (p) => {
        },
        (err, data) => {
          if (err !== undefined) {
            const url = data.Location;
            const content = {
              content: `${input.val()}`,
              url: `${url}`
            };
            const author = this.token.getUser().account;
            this.http.addCard({
              content: `${JSON.stringify(content)}`,
              author: `${author}`
            }, {
              onPreExecute: () => {
              },
              onPostExecute: (result, error) => {
                if (error === undefined && result.code === 200) {
                  this.alert.show({
                    type: 'success',
                    title: '提示',
                    content: '创建卡片成功'
                  });
                } else {
                  this.alert.show({
                    type: 'danger',
                    title: '提示',
                    content: '创建卡片失败'
                  });
                }
              }
            });
          } else {
            this.alert.show({
              type: 'danger',
              title: '提示',
              content: '上传背景图片失败'
            });
          }
        });
    }
  }

  loadMore() {
    this.getCard(this.start, 20);
  }

}
