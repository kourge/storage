# Storage
The type checked localStorage API you might have always been looking for.

## What this library does
The localStorage polyfill and replacements is a crowded place. Most of these are 
fantastic libraries, but none satisfied all the requirements that I wanted.

1. Typechecked
1. Fully Compatible Storage API. (many are missing keys and length)
1. Ability to differentiate between `sessionStorage` and `localStorage`
1. Tested
1. Works on Safari incognito mode. 

Along the way I also noticed that polyfills for `document.cookie` were 
missing a few key features for cookies, such as cookies in the past not
being removed.

This library is far from perfect, but it meets all the criteria I need. 

# Installation & Usage      
Installing through npm is done as one would normally expect:
 
```
$ npm install --save @urbandoor/storage
```

Usage in webpack/typescript works as follows:

```typescript
import Storage from '@urbandoor/storage';

const storage = new Storage();

storage.setItem('potato', 'true');
storage.getItem('potato'); // 'true'
storage.length; // 1
storage.keys(0); // potato
storage.removeItem('potato');
storage.setItem('potato1', 'true');
storage.setItem('potato2', 'true');
storage.setItem('potato3', 'true');
storage.setItem('potato4', 'true');
storage.clear();
storage.getItem('potato1'); // null
```

## Features not implemented yet

1. IE user data.
1. Typescript typecheck-ed wrapper that handles parsing.
1. Probably a lot of things.
