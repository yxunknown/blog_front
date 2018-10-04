import {AfterViewInit, Component, OnInit} from '@angular/core';

import Stackedit from 'stackedit-js';
import marked from 'marked';

@Component({
  selector: 'app-write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.scss']
})
export class WriteArticleComponent implements OnInit {
  stackedit: any;
  textarea: any;

  input: string;

  constructor() {
    this.stackedit = new Stackedit();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.textarea = document.getElementById('editor');
    this.stackedit.on('fileChange', (file) => {
      this.textarea.value = file.content.text;
      document.getElementById('md-previewer').innerHTML = marked(file.content.text);
    });
    // init the height of editor area
    // base on the available web height
    const height = document.documentElement.clientHeight - 40;
    const editor = document.getElementById('edit-area-wrapper');
    editor.style.height = height + 'px';
    const writeWrapper = document.getElementById('write-wrapper');
    writeWrapper.style.height = height - 80 + 'px';
    const mdPreviewer = document.getElementById('md-previewer');
    mdPreviewer.style.height = height - 80 +　'px';
  }

  markdown() {
    this.stackedit.openFile({
      name: 'Filename', // with an optional filename
      content: {
        text: this.textarea.value // and the Markdown content.
      }
    });
  }

  openPreview() {
    const writeWrapper = document.getElementById('write-wrapper');
    const previewer = document.getElementById('md-previewer');
    if (writeWrapper.classList.contains('half')) {
      // in preview state
      // change to full edit
      writeWrapper.classList.remove('half');
      writeWrapper.classList.add('whole');
      previewer.classList.remove('half');
      previewer.classList.add('none');
    } else {
      writeWrapper.classList.remove('whole');
      writeWrapper.classList.add('half');
      previewer.classList.remove('none');
      previewer.classList.add('half');
    }
  }

  syncMarkdown() {
    const value = this.textarea.value;
    const previewer = document.getElementById('md-previewer');
    previewer.innerHTML = marked(value);
    previewer.scrollTo(0, previewer.scrollHeight);
  }

  data() {
    alert(document.documentElement.clientHeight);
  }

}
