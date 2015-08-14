/// <reference path="../typings/jasmine/jasmine.d.ts"/>
var formToObj = require('../form-to-obj');

describe('form-to-obj', function () {

  it('Serializes inputs', function () {
    var form = new MockForm({
      fields: [new MockInput('username', 'Chris')]
    });

    var obj = formToObj(form);

    expect(Object.keys(obj).length).toBe(1);
    expect(obj.username).toBe('Chris');
  });

  it('Handles contenteditable', function () {
    var form = new MockForm({
      fields: [{
        attrs: {
          contenteditable: 'true',
          'data-name': 'yo'
        },
        innerHTML: 'Hey!'
      }]
    });

    var obj = formToObj(form);
    expect(Object.keys(obj).length).toBe(1);
    expect(obj.yo).toBe('Hey!');
  });

  it('Serializes arrays', function () {
    var form = new MockForm({
      fields: [{
        name: 'favs[]',
        value: 'choc',
        type: 'checkbox',
        checked: true
      }, {
        name: 'favs[]',
        value: 'vanil',
        type: 'checkbox',
        checked: true
      }]
    });

    var obj = formToObj(form);

    expect(Object.keys(obj).length).toBe(1);
    expect(obj.favs).toEqual(['choc', 'vanil']);
  });

  it('Does not serialize unchecked inputs', function () {
    var form = new MockForm({
      fields: [{
        name: 'favs[]',
        value: 'choc',
        type: 'checkbox',
        checked: false
      }, {
        name: 'favs[]',
        value: 'vanil',
        type: 'checkbox',
        checked: true
      }]
    });

    var obj = formToObj(form);

    expect(Object.keys(obj).length).toBe(1);
    expect(obj.favs).toEqual(['vanil']);
  });

  it('Serializes only checked radios', function () {
    var form = new MockForm({
      fields: [{
        name: 'gender',
        value: 'm',
        type: 'radio',
        checked: false
      }, {
        name: 'gender',
        value: 'f',
        type: 'radio',
        checked: true
      }]
    });

    var obj = formToObj(form);

    expect(Object.keys(obj).length).toBe(1);
    expect(obj.gender).toEqual('f');
  });

  it('Serializes nested objects', function () {
    var form = new MockForm({
      fields: [{
        name: 'address.street',
        value: '123 somewhere',
        type: 'text'
      }, {
        name: 'address.city',
        value: 'durham',
        type: 'text'
      }, {
        name: 'user.auth.username',
        value: 'cd',
        type: 'text'
      }]
    });

    var obj = formToObj(form);

    expect(Object.keys(obj).length).toBe(2);
    expect(obj.address.street).toEqual('123 somewhere');
    expect(obj.address.city).toEqual('durham');
    expect(obj.user.auth.username).toEqual('cd');
  });

  it('Ignores fields with no name', function () {
    var form = new MockForm({
      fields: [{
        attrs: {
          contenteditable: 'true'
        },
        innerHTML: 'Hey!'
      }, {
        name: 'joe',
        value: 'shmo',
        type: 'text'
      }, {
        value: 'baz',
        type: 'text'
      }]
    });

    var obj = formToObj(form);
    expect(Object.keys(obj).length).toBe(1);
    expect(obj.joe).toBe('shmo');
  });

  it('Serializes arrays', function () {
    var form = new MockForm({
      fields: [{
        name: 'user[45].name',
        value: 'a',
        type: 'text'
      }, {
        name: 'user[20].name',
        value: 'b',
        type: 'text'
      }, {
        name: 'user[50].name',
        value: 'c',
        type: 'text'
      }]
    });

    var obj = formToObj(form);

    expect(Object.keys(obj).length).toBe(1);
    expect(obj.user.length).toBe(3);
    expect(obj.user.map(function (u) {
      return u.name;
    })).toEqual(['b', 'a', 'c']);
  });

});

function MockInput(name, value, inputType) {
  this.name = name;
  this.value = value;
  this.type = inputType || 'input';
}

function MockForm(args) {
  this.fields = args.fields;

  args.fields.forEach(function (f) {
    var attrs = f.attrs || {};
    delete f.attrs;
    f.getAttribute || (f.getAttribute = function (name) {
      return attrs[name];
    });
  });
}

MockForm.prototype = {
  querySelectorAll: function (fields) {
    var fieldsArr = fields.split(/,/).map(function (s) {
      return s.trim();
    });

    if (fieldsArr.indexOf('input') < 0 ||
        fieldsArr.indexOf('select') < 0 ||
        fieldsArr.indexOf('textarea') < 0 ||
        fieldsArr.indexOf('[contenteditable=true]') < 0) {
      throw new Error('Expected to select inputs, selects, contenteditable, and textareas');
    }

    return this.fields;
  }
};