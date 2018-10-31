import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private subject = new Subject<any>();

  constructor() {
  }

  show(value) {
    this.subject.next(value);
  }

  onShow(callback: (value) => void) {
    this.subject.asObservable().subscribe({
      next: value => {
        if (value === 'show' || value === 'close') {
          callback(value);
        }
      }
    });
  }

  onPositiveClick(callback: () => void) {
    this.subject.asObservable().subscribe(
      {
        next: value => {
          if (value === 'positive_click_event') {
            callback();
          }
        }
      }
    );
  }

  onNegativeClick(callback: () => void) {
    this.subject.asObservable().subscribe({
      next: value => {
        if (value === 'negative_click_event') {
          callback();
        }
      }
    });
  }

  onClose(callback: () => void) {
    this.subject.asObservable().subscribe({
      next: value => {
        if (value === 'close_event') {
          callback();
        }
      }
    });
  }

  emit(value) {
    this.subject.next(value);
  }
}
