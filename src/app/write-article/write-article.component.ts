import {AfterViewInit, Component, OnInit} from '@angular/core';

import Stackedit from 'stackedit-js';
import marked from 'marked';
import {CosService} from '../services/cos.service';
import * as $ from 'jquery';
import {HttpService} from '../services/http.service';
import hljs from 'highlight.js';
import {AlertService} from '../services/alert.service';
import {TokenService} from '../services/token.service';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';

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

  currentImageUrl = '';

  constructor(
    private cos: CosService,
    private http: HttpService,
    private alert: AlertService,
    private token: TokenService,
    private storage: StorageService,
    private route: Router
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
    // highlight code
    $('pre code').each((i, block) => {
      hljs.highlightBlock(block);
    });
  }

  uploadArticle() {
    const title = $('#articleTitle');
    if (title.val() === '') {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '请填写文章标题'
      });
      return;
    }
    if (this.textarea.value === '') {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '请输入文章内容'
      });
      return;
    }
    let cover = '';
    if (this.cover !== undefined) {
      cover = this.cover.id;
    }
    let catalog = '';
    if (this.currentCatalog !== undefined) {
      catalog = this.currentCatalog.id;
    }
    const article = {
      title: `${title.val()}`,
      content: this.textarea.value,
      author: this.token.getUser().account,
      cover: cover,
      catalog: catalog,
      tag: this.tags.join('#,'),
      datetime: ''
    };
    this.http.addArticle(article, {
      onPreExecute: () => {
      },
      onPostExecute: (data, err) => {
        if (err === undefined && data.code === 200) {
          this.alert.show({
            type: 'success',
            title: '提示',
            content: '发布文章成功'
          });
        } else {
          console.log(err);
        }
      }
    });
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
      this.isImageUploading = false;
      if (err === undefined) {
        $('#uploadImageTip').text('图片上传失败');
      } else {
        this.currentImageUrl = result.Location;
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
    this.currentImageUrl = (urlInput as any).value;
  }

  addImageToContent() {
    if (this.currentImageUrl === '') {
      this.alert.show({
        type: 'info',
        title: '提示',
        content: '插入图片地址不能为空，请上传本地图片或填入网络图片地址'
      });
    } else {
      const editor = $('#editor');
      editor.val(editor.val() + `\n![image](${this.currentImageUrl})`);
      this.syncMarkdown();
      $('#closeImageInsert').click();
    }
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
          onPreExecute: () => {
          },
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

  saveToDraft() {
    const title = $('#articleTitle');
    if (title.val() === '') {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '请填写文章标题'
      });
      return;
    }
    if (this.textarea.value === '') {
      this.alert.show({
        type: 'danger',
        title: '提示',
        content: '请输入文章内容'
      });
      return;
    }
    let cover = '';
    if (this.cover !== undefined) {
      cover = this.cover.id;
    }
    let catalog = '';
    if (this.currentCatalog !== undefined) {
      catalog = this.currentCatalog.id;
    }
    const article = {
      title: `${title.val()}`,
      content: this.textarea.value,
      author: this.token.getUser().account,
      cover: cover,
      catalog: catalog,
      tag: this.tags.join('#,'),
      datetime: ''
    };
    this.storage.storageArticle(title, article);
    this.alert.show({
      type: 'success',
      title: '提示',
      content: '保存文章成功'
    });
  }

  routeToHome() {
    this.route.navigate(['/home']);
  }

}
