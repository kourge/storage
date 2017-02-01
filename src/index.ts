export function generateCookie(
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

export interface Cookier {
  cookie: string;
}

export interface Storable {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, data: string): void;
}

export function cookieStorage (
  isSession: boolean,
  cookier: Cookier = document,
  prefix = '__storage__'
): Storable {
  return {
    get length() {
      return cookier.cookie.split(';').filter(
        (cookie) => cookie.indexOf(prefix) !== -1).length;
    },

    clear() {
      cookier.cookie.split(';').filter(
        (cookie) => cookie.indexOf(prefix) !== -1
      ).map(
        (nameWithEq) => {
          return nameWithEq.split('=')[0].trim().substring(prefix.length);
        }
      ).forEach(
        (name) => {
          return this.removeItem(name);
        }
      );
    },

    getItem(key: string): string | null {
      const prefixedNameWithEq = `${prefix}${key}=`;
      const cookieList = cookier.cookie.split(';');
      for (let cookieName of cookieList) {
        cookieName = cookieName.trim();
        if (cookieName.indexOf(prefixedNameWithEq) === 0) {
          return cookieName.substring(
            prefixedNameWithEq.length,
            cookieName.length
          );
        }
      }
      return null;
    },

    setItem(key: string, data: string): void {
      cookier.cookie = isSession
        ? generateCookie(key, data, 0, prefix)
        : generateCookie(key, data, 30, prefix);
    },

    removeItem(key: string) {
      cookier.cookie = generateCookie(key, '', -1, prefix);
    },

    key(index: number) {
      const cookies = cookier.cookie
        .split(';')
        .filter((cookie) => cookie.indexOf(prefix) !== -1);
      const val = cookies[index];

      return val ? val : null;
    }
  };
}

export default class <T extends {}> implements Storable {
  private storageMedium: Storable;

  constructor(private session = false, private cookier: Cookier = document) {
    try {
      localStorage.setItem('testtesttest', '1');
      localStorage.removeItem('testtesttest');
      // tslint:disable-next-line:no-string-literal
      if ('localStorage' in window && window['localStorage'] !== null) {
        this.storageMedium = this.session
          ? window.sessionStorage
          : window.localStorage;
      } else {
        this.storageMedium = cookieStorage(this.session, this.cookier);
      }
    } catch (_) {
      this.storageMedium = cookieStorage(this.session, this.cookier);
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
