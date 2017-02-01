
export interface Storable {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, data: string): void;
}

function generateCookie(
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

function cookieStorage (
  isSession: boolean,
  prefix = '__storage__'
): Storable {
  return {
    get length() {
      return document.cookie.split(';').filter(
        (cookie) => cookie.indexOf(prefix) !== -1).length;
    },

    clear() {
      document.cookie.split(';').filter(
        (cookie) => cookie.indexOf(prefix) !== -1
      ).map(
        (c) => c.substring(prefix.length)
      ).forEach(
        (c) => this.removeItem(c)
      );
    },

    getItem(key: string): string | null {
      const nameEQ = `${prefix}${key}=`;
      const ca = document.cookie.split(';');
      for (let c of ca) {
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
      return null;
    },

    setItem(key: string, data: string): void {
      document.cookie = isSession
        ? generateCookie(key, data, 0, prefix)
        : generateCookie(key, data, 30, prefix);
    },

    removeItem(key: string) {
      document.cookie = generateCookie(key, '', -1, prefix);
    },

    key(index: number) {
      const cookies = document.cookie
        .split(';')
        .filter((cookie) => cookie.indexOf(prefix) !== -1);
      const val = cookies[index];

      return val ? val : null;
    }
  };
}

export default class <T extends {}> implements Storable {
  private storageMedium: Storable;

  constructor(private session = false) {
    try {
      localStorage.setItem('testtesttest', '1');
      localStorage.removeItem('testtesttest');
      // tslint:disable-next-line:no-string-literal
      if ('localStorage' in window && window['localStorage'] !== null) {
        this.storageMedium = this.session
          ? window.sessionStorage
          : window.localStorage;
      } else {
        this.storageMedium = cookieStorage(this.session);
      }
    } catch (_) {
      this.storageMedium = cookieStorage(this.session);
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
