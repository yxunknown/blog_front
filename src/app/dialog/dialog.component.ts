import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DialogService} from '../services/dialog.service';
import {ModalDirective} from 'angular-bootstrap-md';

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
  isShowModal: boolean;
  @ViewChild('dialog') dialogCom: ModalDirective;
  constructor(private dialog: DialogService) {
    this.isShowModal = true;
  }

  ngOnInit() {
    if (this.title === undefined) {
      this.title = '提示';
    }
    this.dialog.onShow(value => {
      if (value === 'show') {
        this.dialogCom.show();
      } else {
        setTimeout(() => {
          this.dialogCom.hide();
        }, 300);
      }
    });
  }
  ok() {
    this.dialog.emit('positive_click_event');
  }
  cancel() {
    this.dialog.emit('positive_click_event');
  }
}


