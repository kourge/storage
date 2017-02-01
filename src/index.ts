import {CookieJar, CookieStorage} from './cookie_storage';
import {StorageEngine} from './storage_engine';
export default class <T extends {}> implements StorageEngine {
  private storageMedium: StorageEngine;

  constructor(private session = false, private cookier: CookieJar = document) {
    try {
      localStorage.setItem('testtesttest', '1');
      localStorage.removeItem('testtesttest');
      // tslint:disable-next-line:no-string-literal
      if ('localStorage' in window && window['localStorage'] !== null) {
        this.storageMedium = this.session
          ? window.sessionStorage
          : window.localStorage;
      } else {
        this.storageMedium = new CookieStorage(this.session, this.cookier);
      }
    } catch (_) {
      this.storageMedium = new CookieStorage(this.session, this.cookier);
    }
  }

  public get length(): number {
    return this.storageMedium.length;
  }

  public getItem(key: string) {
    return this.storageMedium.getItem(key);
  }

  public setItem(key: keyof T, data: string) {
    return this.storageMedium.setItem(key, data);
  }

  public clear() {
    return this.storageMedium.clear();
  }

  public removeItem(key: keyof T) {
    return this.storageMedium.removeItem(key);
  }

  public key(index: number) {
    return this.storageMedium.key(index);
  }
}
