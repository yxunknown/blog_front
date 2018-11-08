import {Component, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  type: string;
  title: string;
  content: string;
  constructor(private alert: AlertService) {
  }

  ngOnInit() {
    this.alert.subscribe((type, title, content) => {
      this.type = type;
      this.title = title;
      this.content = content;
      $('#alert').addClass('show');
    });
  }

  close() {
    $('#alert').removeClass('show');
  }

}
