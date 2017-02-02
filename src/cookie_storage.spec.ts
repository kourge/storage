import {expect} from 'chai';
import * as moment from 'moment';
import {
  CookieStorage,
  LOCAL_STORAGE_DAYS
} from './cookie_storage';
import {
  dateFormat,
  InMemoryCookieJar
} from './in_memory_cookie_jar';

describe('storage', () => {
  let cookieStorage: CookieStorage;
  let memoryCookieJar: InMemoryCookieJar;
  beforeEach(() => {
    memoryCookieJar = new InMemoryCookieJar();
  });
  describe('session cookies', () => {
    beforeEach(() => {
      memoryCookieJar.value = {};
      cookieStorage = new CookieStorage(true, memoryCookieJar);
    });

    it('should add a cookie', () => {
      cookieStorage.setItem('potato', 'true');
      expect(memoryCookieJar.value).to.eql({
        __storage__potato: {
          key: '__storage__potato',
          value: 'true',
          path: 'path=/'
        }
      });
    });

    it('should get the cookie', () => {
      cookieStorage.setItem('potato', 'true');
      expect(cookieStorage.getItem('potato')).to.equal('true');
    });

    it('should allow a length', () => {
      cookieStorage.setItem('potato', 'true');
      cookieStorage.setItem('potato1', 'true');
      cookieStorage.setItem('potato2', 'true');
      cookieStorage.setItem('potato3', 'true');
      expect(cookieStorage.length).to.equal(4);
    });

    it('should remove values', () => {
      cookieStorage.setItem('potato', 'true');
      cookieStorage.setItem('potato1', 'true');
      cookieStorage.setItem('potato2', 'true');
      cookieStorage.setItem('potato3', 'true');

      cookieStorage.removeItem('potato1');
      expect(cookieStorage.length).to.equal(3);
      expect(cookieStorage.getItem('potato1')).to.be.null;
    });

    it('should clear the values', () => {
      cookieStorage.setItem('potato', 'true');
      cookieStorage.setItem('potato1', 'true');
      cookieStorage.setItem('potato2', 'true');
      cookieStorage.setItem('potato3', 'true');
      cookieStorage.clear();
      expect(cookieStorage.length).to.equal(0);
    });

    it('should _only_ get items that are prefixed', () => {
      memoryCookieJar.cookie = 'potato=yay';
      expect(cookieStorage.getItem('potato')).to.be.null;
    });
  });

  describe('local storage cookies', () => {
    beforeEach(() => {
      memoryCookieJar.value = {};
      cookieStorage = new CookieStorage(false, memoryCookieJar);
    });

    it('should set an expiry time', () => {
      const date = new Date();
      date.setTime(date.getTime() + (LOCAL_STORAGE_DAYS * 24 * 60 * 60 * 1000));
      const expiresDate = moment(date.toUTCString(), dateFormat)
        .startOf('day');
      cookieStorage.setItem('potato', 'yay');
      // tslint:disable-next-line:no-string-literal
      const expires = memoryCookieJar.value['__storage__potato'].expires!;
      expect(expires.startOf('day')).eql(expiresDate);
    });
  });
});
