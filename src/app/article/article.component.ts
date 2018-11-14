import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import marked from 'marked';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, AfterViewInit {

  @Input() article: any;
  @ViewChild('articleContainer') container: ElementRef;
  @ViewChild('btnShowAll') btnShowAll: ElementRef;
  @ViewChild('coverImage') coverImage: ElementRef;
  isShowingAllContent: boolean;
  isShowCover: boolean;
  constructor() { }

  ngOnInit() {
    this.isShowingAllContent = false;
  }
  ngAfterViewInit() {
    this.container.nativeElement.innerHTML = marked(this.article.content);
    this.isShowCover = this.article.cover.path !== '';
  }
  showAllContent() {
    if (!this.isShowingAllContent) {
      this.container.nativeElement.style.height = 'auto';
      this.btnShowAll.nativeElement.innerText = '收起全文';
      this.isShowingAllContent = true;
      // handle cover
      if (this.isShowCover) {
        const img = `<img src="${this.article.cover.path}"></img>`;
        this.container.nativeElement.innerHTML = img + this.container.nativeElement.innerHTML;
        this.isShowCover = false;
      }
    } else {
      this.container.nativeElement.style.height = '100px';
      this.btnShowAll.nativeElement.innerText = '展开全文';
      this.isShowingAllContent = false;
      this.isShowCover = this.article.cover.path !== '';
      this.container.nativeElement.innerHTML = marked(this.article.content);
    }
  }

}
