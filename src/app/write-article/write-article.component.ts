import { AfterViewInit, Component, OnInit } from '@angular/core';

import Stackedit from 'stackedit-js';

@Component({
  selector: 'app-write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.scss']
})
export class WriteArticleComponent implements OnInit {
  stackedit: any;
  textarea: any;

  constructor() {
    this.stackedit = new Stackedit();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    console.log('view inited');
    console.log(document.documentElement.clientHeight);
    console.log(window.screen.availHeight);
    this.textarea = document.getElementById('editor');
    this.stackedit.on('fileChange', (file) => {
      this.textarea.value = file.content.text;
    });
  }

  markdown() {
    this.stackedit.openFile({
      name: 'Filename', // with an optional filename
      content: {
        text: this.textarea.value // and the Markdown content.
      }
    });
  }

}
