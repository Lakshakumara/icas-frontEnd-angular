// src/app/services/loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Loading...');

  loadingAction$: Observable<boolean> = this.loadingSubject.asObservable();
  messageAction$: Observable<string> = this.messageSubject.asObservable();

  constructor() {}

  showLoader(message: string = 'Loading...') {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  updateMessage(message: string) {
    this.messageSubject.next(message);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }
}
