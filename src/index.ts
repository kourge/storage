import {CookieJar, CookieStorage} from './cookie_storage';
import {StorageEngine} from './storage_engine';
export default class UniversalStorage implements StorageEngine {
  private engine: StorageEngine;

  constructor(
    private isSession = false,
    private cookier: CookieJar = document
  ) {
    try {
      localStorage.setItem('testtesttest', '1');
      localStorage.removeItem('testtesttest');
      // tslint:disable-next-line:no-string-literal
      if ('localStorage' in window && window['localStorage'] !== null) {
        this.engine = this.isSession
          ? window.sessionStorage
          : window.localStorage;
      } else {
        this.engine = new CookieStorage(this.isSession, this.cookier);
      }
    } catch (_) {
      this.engine = new CookieStorage(this.isSession, this.cookier);
    }
  }

  public get length(): number {
    return this.engine.length;
  }

  public getItem(key: string) {
    return this.engine.getItem(key);
  }

  public setItem(key: string, data: string) {
    return this.engine.setItem(key, data);
  }

  public clear() {
    return this.engine.clear();
  }

  public removeItem(key: string) {
    return this.engine.removeItem(key);
  }

  public key(index: number) {
    return this.engine.key(index);
  }
}
