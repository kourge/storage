import * as moment from 'moment';
import {CookieJar} from './cookie_storage';

export const dateFormat = 'ddd, DD MMM YYYY HH:mm:ss';

export interface Cookie {
  key: string;
  value: string;
  expires?: moment.Moment;
  path?: string;
}

interface InMemoryCookieJar extends CookieJar {
  value: {[key: string]: Cookie};
}

export function parseCookie(cookie: string): Cookie {
  const [key] = cookie.split('=');
  const cookieWithoutValue = cookie.substring(key.length + 1);
  const [value, ...rest] = cookieWithoutValue.split(';');
  const cookedCookie: Cookie = {key, value};
  if (rest.length === 2) {
    const [_, expires] = rest[0].split('=');
    cookedCookie.expires = moment(expires.trim(), dateFormat);
    cookedCookie.path = rest[1].trim();
  }
  if (rest.length === 1) {
    cookedCookie.path = rest[0].trim();
  }

  return cookedCookie;
}

export const memoryCookieJar: InMemoryCookieJar = {
  value: {},

  get cookie() {
    let result = '';
    const {value} = this;
    Object.keys(value).forEach((key) => {
      const {expires} = value[key];
      // if there is an expiry and the expiry is in the past
      // delete it. This is just how cookies work, unfortunately.
      if (expires && expires.diff(moment()) < 0) {
        delete value[key];
      }
    });
    // cookies returned from 'document.cookie' only have the key and value
    // shown, but the other values are there, just hidden
    Object.keys(value).forEach((key) => {
      const {value: cookieValue} = value[key];
      result += `${key}=${cookieValue}; `;
    });
    return result.trim();
  },

  set cookie(value) {
    const cookie = parseCookie(value);
    if (moment().diff(cookie.expires) > 0) {
      delete this.value[cookie.key];
      return;
    }
    this.value[cookie.key] = cookie;
  }
};
