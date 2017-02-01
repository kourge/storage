import {expect} from 'chai';
import * as moment from 'moment';
import {
  Cookie,
  dateFormat,
  memoryCookieJar,
  parseCookie
} from './in_memory_cookie_jar';

describe('parseCookie', () => {
  let result: Cookie;

  describe('without dates', () => {
    beforeEach(() => {
      result = parseCookie('key=value; path=/');
    });

    it('should have a key of key', () => {
      expect(result.key).to.equal('key');
    });

    it('should have a value of value', () => {
      expect(result.value).to.equal('value');
    });

    it('should have a path of path=/', () => {
      expect(result.path).to.equal('path=/');
    });
  });

  describe('with dates', () => {
    let now = new Date();
    beforeEach(() => {
      result = parseCookie(`key=value; expires=${now.toUTCString()} ;path=/`);
    });

    it('should have a key of key', () => {
      expect(result.key).to.equal('key');
    });

    it('should have a value of value', () => {
      expect(result.value).to.equal('value');
    });

    it('should have a path of path=/', () => {
      expect(result.path).to.equal('path=/');
    });

    it('should have an expiry of now', () => {
      expect(moment(now.toUTCString(), dateFormat)).to.eql(result.expires);
    });
  });
});

describe('memoryCookieJar', () => {
  beforeEach(() => {
    memoryCookieJar.value = {};
  });

  it('should return an empty string if no cookies are set', () => {
    expect(memoryCookieJar.cookie).to.equal('');
  });

  it('should parse and set the cookie', () => {
    memoryCookieJar.cookie = 'value=key;';
    const parsedCookie = parseCookie('value=key;');
    expect(memoryCookieJar.value).to.eql({
      [parsedCookie.key]: parsedCookie
    });
  });

  it('should get a set cookie', () => {
    memoryCookieJar.cookie = 'value=key;';
    expect(memoryCookieJar.cookie).to.eql('value=key;');
  });

  it('should only get the value and key', () => {
    memoryCookieJar.cookie = 'value=key; path=/';
    expect(memoryCookieJar.cookie).to.eql('value=key;');
  });

  it('should delete a cookie in the past', () => {
    memoryCookieJar.cookie = 'value=key;';
    const pastDate = moment().subtract({days: 2}).toDate();
    memoryCookieJar.cookie =
      `value=key; expires=${pastDate.toUTCString()}; path=/`;
    // tslint:disable-next-line:no-string-literal
    expect(memoryCookieJar.value['value']).to.not.exist;
  });

  it('should not get cookies in the past', () => {
    const pastDate = moment().subtract({days: 2}).toDate();
    const cookie = parseCookie(
      `value=key; expires=${pastDate.toUTCString()}; path=/`
    );
    memoryCookieJar.value[cookie.key] = cookie;
    expect(memoryCookieJar.cookie).to.equal('');
  });
});
