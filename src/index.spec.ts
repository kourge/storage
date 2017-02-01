import {expect} from 'chai';
import {cookieStorage, Storable} from './';
import {mock} from './cookie_helpers';

describe('storage', () => {
  let cookie: Storable;
  beforeEach(() => {
    mock.value = {};
    cookie = cookieStorage(true, mock);
  });

  it('should add a cookie', () => {
    cookie.setItem('potato', 'true');
    expect(mock.value).to.eql({
      __storage__potato: {
        key: '__storage__potato',
        value: 'true',
        path: 'path=/'
      }
    });
  });

  it('should get the cookie', () => {
    cookie.setItem('potato', 'true');
    expect(cookie.getItem('potato')).to.equal('true');
  });

  it('should allow a length', () => {
    cookie.setItem('potato', 'true');
    cookie.setItem('potato1', 'true');
    cookie.setItem('potato2', 'true');
    cookie.setItem('potato3', 'true');
    expect(cookie.length).to.equal(4);
  });

  it('should remove values', () => {
    cookie.setItem('potato', 'true');
    cookie.setItem('potato1', 'true');
    cookie.setItem('potato2', 'true');
    cookie.setItem('potato3', 'true');

    cookie.removeItem('potato1');
    expect(cookie.length).to.equal(3);
    expect(cookie.getItem('potato1')).to.be.null;
  });

  it('should clear the values', () => {
    cookie.setItem('potato', 'true');
    cookie.setItem('potato1', 'true');
    cookie.setItem('potato2', 'true');
    cookie.setItem('potato3', 'true');
    cookie.clear();
    expect(cookie.length).to.equal(0);
  });

  it('should _only_ get items that are prefixed', () => {
    mock.cookie = 'potato=yay';
    expect(cookie.getItem('potato')).to.be.null;
  });
});
