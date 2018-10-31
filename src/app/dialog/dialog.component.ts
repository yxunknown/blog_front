import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})


export class DialogComponent implements OnInit {

  @Input() title: string;
  @Input() content: string;
  @Input() positive: string;
  @Input() negative: string;
  @Input() isShowClose: boolean;

  showModal: any;
  constructor(private dialog: DialogService) {
    this.showModal = false;
  }

  ngOnInit() {
    if (this.title === undefined) {
      this.title = '提示';
    }
    this.dialog.onShow(this.show);
  }

  show(value) {
    this.showModal = value === 'show';
  }

  ok() {
    this.dialog.emit('positive_click_event');
  }
  cancel() {
    this.dialog.emit('positive_click_event');
  }
}


