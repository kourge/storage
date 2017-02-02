import {StorageEngine} from './storage_engine';

export const LOCAL_STORAGE_DAYS = 30;
export const SESSION_STORAGE_DAYS = 0;

export interface CookieJar {
  cookie: string;
}

export function makeCookie(
  key: string,
  data: string,
  days: number,
  prefix: string
): string {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = days !== 0
    ? `; expires=${date.toUTCString()}`
    : '';
  return `${prefix}${key}=${data}${expires}; path=/`;
}

export class CookieStorage implements StorageEngine {
  constructor(
    private readonly isSession: boolean,
    private readonly cookieJar: CookieJar,
    private readonly prefix = '__storage__'
  ) {}

  private get cookies(): string[] {
    return this.cookieJar.cookie.split(';').filter(
      (cookie) => cookie.indexOf(this.prefix) !== -1
    );
  }

  public get length() {
    return this.cookies.length;
  }

  public clear() {
    this.cookies.map(
      (pair: string) => pair.split('=')[0].trim().substring(this.prefix.length)
    ).forEach(
      (name: string) => this.removeItem(name)
    );
  }

  public getItem(key: string): string | null {
    const prefixedPair = `${this.prefix}${key}=`;
    const cookieList = this.cookieJar.cookie.split(';');
    for (let cookieName of cookieList) {
      cookieName = cookieName.trim();
      if (cookieName.indexOf(prefixedPair) === 0) {
        return cookieName.substring(
          prefixedPair.length,
          cookieName.length
        );
      }
    }
    return null;
  }

  public setItem(key: string, data: string): void {
    this.cookieJar.cookie = this.isSession
      ? makeCookie(key, data, SESSION_STORAGE_DAYS, this.prefix)
      : makeCookie(key, data, LOCAL_STORAGE_DAYS, this.prefix);
  }

  public removeItem(key: string) {
    this.cookieJar.cookie = makeCookie(key, '', -1, this.prefix);
  }

  public key(index: number) {
    return this.cookies[index] || null;
  }
}
