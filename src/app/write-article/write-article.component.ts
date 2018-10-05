import {AfterViewInit, Component, OnInit} from '@angular/core';

import Stackedit from 'stackedit-js';
import marked from 'marked';
import {ancestorWhere} from 'tslint/lib/language/utils';

@Component({
  selector: 'app-write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.scss']
})
export class WriteArticleComponent implements OnInit, AfterViewInit {
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

  fileChanged() {
    const fileInput = document.getElementById('fileInput');
    const label = document.getElementById('fileTip');
    label.innerText = (fileInput as any).value;
    const file = (fileInput as any).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', function () {
      const img = document.getElementById('img-previewer');
      img.setAttribute('src', reader.result);
    });
  }
  toLocalImgChose() {
    const localImgTab = document.getElementById('local-tab');
    const netImgTab = document.getElementById('net-tab');
    const localPanel = document.getElementById('pills-local');
    const netPanel = document.getElementById('pills-net');
    if (!localImgTab.classList.contains('active')) {
      localImgTab.classList.add('active');
      netImgTab.classList.remove('active');
      localPanel.classList.add('show');
      localPanel.classList.add('active');
      netPanel.classList.remove('show');
      netPanel.classList.remove('active');
    }
    return false;
  }
  toNetImgChose() {
    const localImgTab = document.getElementById('local-tab');
    const netImgTab = document.getElementById('net-tab');
    const localPanel = document.getElementById('pills-local');
    const netPanel = document.getElementById('pills-net');
    if (!netImgTab.classList.contains('active')) {
      netImgTab.classList.add('active');
      localImgTab.classList.remove('active');
      netPanel.classList.add('show');
      netPanel.classList.add('active');
      localPanel.classList.remove('show');
      localPanel.classList.remove('active');
    }
    return false;
  }
  setNetImgPreview() {
    const urlInput = document.getElementById('img-url');
    const netImgPreviewer = document.getElementById('net-img-previewer');
    netImgPreviewer.setAttribute('src', (urlInput as any).value);
  }

}
