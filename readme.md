# form-to-obj

Tiny, zero-dependency, utility to turn a form into a JavaScript object.

- Zero dependencies
- Roughly 600 bytes minified and gzipped
- Handles arrays and nested objects
- Handles contenteditable

[![Build Status](https://travis-ci.org/chrisdavies/form-to-obj.svg?branch=master)](https://travis-ci.org/chrisdavies/form-to-obj)

## Basic usage

A form such as this:

```html
<form>
  <input name="username" value="John">
  <input name="address.street" value="123 Somewhere">
  <input name="address.city" value="Durham,NC">
  <input name="gender" type="radio" value="m" checked>
  <input name="gender" type="radio" value="f">
  <input name="favorites[]" type="checkbox" value="chocolate" checked>
  <input name="favorites[]" type="checkbox" value="strawberry">
  <input name="favorites[]" type="checkbox" value="vanilla" checked>
</form>
```

When called like this:

```javascript
var obj = formToObj(document.querySelector('form'));
```

Would produce an `obj` value of this:

```javascript
{
  username: 'John',
  address: {
    street: '123 Somewhere',
    city: 'Durham,NC'
  },
  gender: 'm',
  favorites: ['chocolate', 'vanilla']
}
```

## Nested arrays and objects

This form:

```html
<form>
  <input name="user[4].name" value="John">
  <input name="user[4].phone" value="1231231234">
  <input name="user[78].name" value="Sally">
  <input name="user[78].phone" value="7778887777">
  <input name="user[10].name" value="Jane">
  <input name="user[10].phone" value="1001001000">
</form>
```

When serialized, would produce an object like this:

```javascript
{
  user: [
    { name: 'John', phone: '1231231234' },
    { name: 'Jane', phone: '1001001000' },
    { name: 'Sally', phone: '7778887777' }
  ]
}
```

The sort order is not guaranteed, and the indices don't matter, except as a unique way of identifying a record.

## Contenteditable support

If using a contenteditable item, give it a `data-name` attribute in order to take its `innerHTML` value.

This markup:

```html
<div contenteditable="true" data-name="whatevz"><span>Hi</span></div>
```

Would produce an object like this:

```javascript
{
  whatevz: '<span>Hi</span>'
}
```

### Browserify

This library is [CommonJS](http://www.commonjs.org/) compatible, so you can use it in this way:

```javascript
var formToObj = require('form-to-obj'),
var obj = formToObj(document.querySelector('form'));
```

## Installation

Just download form-to-obj.min.js, or use bower:

    bower install form-to-obj

Or use npm:
https://www.npmjs.com/package/form-to-obj

    npm install --save form-to-obj

## Contributing

Make your changes (and add tests), then run the tests:

    npm test

If all is well, build your changes:

    npm run min

## License MIT

Copyright (c) 2015 Chris Davies

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
