import {AfterViewInit, Component, OnInit} from '@angular/core';

import Stackedit from 'stackedit-js';
import marked from 'marked';
import {CosService} from '../services/cos.service';
import * as $ from 'jquery';
import {HttpService} from '../services/http.service';

@Component({
  selector: 'app-write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.scss']
})
export class WriteArticleComponent implements OnInit, AfterViewInit {
  stackedit: any;
  textarea: any;

  input: string;

  isUploading = false;
  tags = [];

  catalogs = [];
  currentCatalog: any;
  cover: any;

  isLocalImgTab = true;

  isImageUploading = false;

  constructor(
    private cos: CosService,
    private http: HttpService
  ) {
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
    mdPreviewer.style.height = height - 80 + 'px';

    // get article catalog
    this.getArticleCatalogs();
  }

  getArticleCatalogs() {
    this.http.getArticleCatalog({
      onPreExecute: () => {
        $('#selectCatalogBtn').text('数据加载中...');
      },
      onPostExecute: (catalog, err) => {
        const selectCatalogBtn = $('#selectCatalogBtn');
        selectCatalogBtn.text('选择文章分类');
        if (err !== undefined) {
          selectCatalogBtn.text('获取文章分类出错，点击重试...');
        } else if (catalog.code !== 200) {
          selectCatalogBtn.text(catalog.info);
        } else {
          this.catalogs = catalog.map.catalogs;
        }
      }
    });
  }

  setCatalog(index) {
    this.currentCatalog = this.catalogs[index];
    const selectCatalogBtn = $('#selectCatalogBtn');
    selectCatalogBtn.click();
    selectCatalogBtn.text(this.currentCatalog.catalog);
  }

  addCatalog() {
    const catalogInput = $('#catalogInput');
    const catalogHelp = $('#catalogHelp');
    if (catalogInput.val() === '') {
      catalogHelp.text('分类不能为空');
    } else {
      const catalog = catalogInput.val() as string;
      this.http.addArticleCatalog(catalog, {
        onPreExecute: () => {
        },
        onPostExecute: (result, err) => {
          console.log(result || err);
          if (err === undefined && result.code === 200) {
            this.catalogs.push(result.map.catalog);
          }
        }
      });
      catalogInput.val('');
      catalogHelp.text('');
    }
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
    const file = (fileInput as any).files[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', function () {
      const img = document.getElementById('img-previewer');
      img.setAttribute('src', reader.result);
    });
    this.isImageUploading = true;
    this.cos.putObject({
      Name: file.name,
      Body: file
    }, progress => {
      console.log(progress);
    }, (err, result) => {
      if (err === undefined) {
        this.isImageUploading = false;
        $('#uploadImageTip').text('图片上传失败');
      } else {
        const photo = {
          id: -1,
          path: result.Location,
          description: '文章图片内容',
          latitude: 0,
          longitude: 0,
          md5: `${result.Etag}`,
          uploadDate: '2018-11-09 12:23:32'
        };
        this.http.uploadPhoto(photo, {
          onPreExecute: () => {},
          onPostExecute: (res, error) => {
            console.log(res || error);
            this.isImageUploading = false;
            if (error === undefined && res.code === 200) {
              const editor = $('#editor');
              const content = editor.val() + `![${file.name}](${result.Location})`;
              editor.val(content);
            } else {
              $('#uploadImageTip').text('图片上传失败');
            }
          }
        });
      }
    });
  }

  toLocalImgChose() {
    this.isLocalImgTab = true;
    return false;
  }

  toNetImgChose() {
    this.isLocalImgTab = false;
    return false;
  }

  setNetImgPreview() {
    const urlInput = document.getElementById('img-url');
    const netImgPreviewer = document.getElementById('net-img-previewer');
    netImgPreviewer.setAttribute('src', (urlInput as any).value);
  }

  coverChange() {
    $('#coverUploadTip').text('');
    if (this.isUploading) {
      return;
    }
    const file = ($('#coverInput').get(0) as any).files[0] as File;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', () => {
      $('#coverPreviewer').attr('src', fileReader.result);
    });
    this.isUploading = true;
    this.cos.putObject({
      Name: file.name,
      Body: file,
    }, process => {
      console.log(process);
    }, (err, data) => {
      if (err !== undefined) {
        const photo = {
          id: -1,
          path: data.Location,
          description: '文章封面',
          latitude: 0,
          longitude: 0,
          md5: `${data.Etag}`,
          uploadDate: '2018-11-09 12:23:32'
        };
        this.http.uploadPhoto(photo, {
          onPreExecute: () => {},
          onPostExecute: (result, error) => {
            console.log(result || error);
            this.isUploading = false;
            if (error !== undefined || result.code !== 200) {
              $('#coverUploadTip').text('封面上传失败，请重试...');
            } else {
              this.cover = result.map.photo;
            }
          }
        });
      } else {
        this.isUploading = false;
        $('#coverUploadTip').text('封面上传失败，请重试...');
      }
    });
  }

  enterTag(event) {
    const input = $('#tagInput');
    if (event.code === 'Enter') {
      this.tags.push(input.val());
      input.val('');
    }
  }

  deleteTag(index) {
    this.tags.splice(index, 1);
  }

}
