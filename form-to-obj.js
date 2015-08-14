function formToObj(form) {
  var fields = formToArr(form);

  fields.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  return fields.reduce(function(obj, field) {
    addProp(obj, field.name, field.value);
    return obj;
  }, {});

  function formToArr(form) {
    var inputs = form.querySelectorAll('input, textarea, select, [contenteditable=true]');
    var arr = [];

    for (var i = 0; i < inputs.length; ++i) {
      var input = inputs[i],
          name = input.name || input.getAttribute('data-name'),
          val = input.value;

      if (!name ||
        ((input.type === 'checkbox' || input.type === 'radio') && !input.checked)) {
        continue;
      }

      if (input.getAttribute('contenteditable') === 'true') {
        val = input.innerHTML;
      }

      arr.push({
        name: name,
        value: val
      });
    }

    return arr;
  }

  function addProp(o, prop, val) {
    var props = prop.split('.');
    var lastProp = props.length - 1;

    props.reduce(function (obj, prop, i) {
      if (i === lastProp) {
        return setProp(obj, prop, val);
      } else {
        return setProp(obj, prop, {});
      }
    }, o);
  }

  function setProp(obj, name, val) {
    if (name.slice(-2) === '[]') {
      makeArr(obj, name).push(val);
    } else if (obj[name]) {
      return obj[name];
    } else if (name[name.length - 1] === ']') {
      var arr = makeArr(obj, name);

      if (arr.prevName === name) {
        return arr[arr.length - 1];
      }

      arr.push(val);
      arr.prevName = name;
    } else {
      obj[name] = val;
    }

    return val;
  }

  function makeArr(obj, name) {
    var arrName = name.replace(/\[\d*\]/, '');
    return (obj[arrName] || (obj[arrName] = []));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = formToObj;
}