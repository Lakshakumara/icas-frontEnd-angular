import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class GravatarService {
  constructor() {}

  getGravatarUrl(email: string, size: number = 200): string {
    const emailHash = Md5.hashStr(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon`;
  }
}